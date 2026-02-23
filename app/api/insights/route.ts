import { NextResponse } from "next/server";
import crypto from "crypto";

// Types
interface Process {
  id: string;
  burstTime: number;
  arrivalTime?: number;
  priority?: number;
}

interface Metric {
  processId: string;
  waitingTime: number;
  turnaroundTime?: number;
  responseTime?: number;
}

interface GanttEntry {
  processId: string;
  startTime: number;
  endTime: number;
}

interface MLQConfig {
  q1TimeQuantum?: number;
  q2TimeQuantum?: number;
}

interface Results {
  metrics: Metric[];
  ganttChart: GanttEntry[];
}

interface InsightsBody {
  algorithm: string;
  timeQuantum?: number;
  mlqConfig?: MLQConfig;
  processes: Process[];
  results?: Results;
}

// In-memory cache
const insightsCache = new Map<string, { insights: string; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function hashBody(body: InsightsBody): string {
  return crypto
    .createHash("md5")
    .update(JSON.stringify(body))
    .digest("hex");
}

function buildHeuristicInsights(body: InsightsBody | null): string {
  if (!body) {
    return "Run a simulation with at least one process to see AI performance insights for this schedule.";
  }

  const { algorithm, timeQuantum, mlqConfig, processes = [], results } = body;
  const metrics: Metric[] = results?.metrics ?? [];
  const gantt: GanttEntry[] = results?.ganttChart ?? [];

  if (!results || metrics.length === 0 || processes.length === 0) {
    return "Run a simulation with at least one process to see AI performance insights for this schedule.";
  }

  const avgWait =
    metrics.reduce((acc: number, m: Metric) => acc + (m.waitingTime ?? 0), 0) /
    Math.max(metrics.length, 1);

  const highWait = metrics.filter(
    (m: Metric) => (m.waitingTime ?? 0) > avgWait * 1.5
  );

  const highWaitLines =
    highWait.length === 0
      ? ["Waiting times are fairly balanced; no single process is heavily penalized."]
      : highWait.map((m: Metric) => {
        const factor =
          avgWait > 0
            ? ((m.waitingTime ?? 0) / avgWait).toFixed(2)
            : "—";
        return `Process ${m.processId} waits noticeably longer than average (~${factor}×).`;
      });

  let convoy = false;

  if (
    gantt.length > 0 &&
    (algorithm === "FCFS" || algorithm === "SJF" || algorithm === "Priority")
  ) {
    const first = gantt[0];
    const firstProc = processes.find((p: Process) => p.id === first.processId);

    if (firstProc) {
      const avgBurst =
        processes.reduce(
          (acc: number, p: Process) => acc + (p.burstTime ?? 0),
          0
        ) / Math.max(processes.length, 1);

      if (firstProc.burstTime > avgBurst * 2) {
        convoy = true;
      }
    }
  }

  const starvation =
    metrics.some((m: Metric) => (m.waitingTime ?? 0) > avgWait * 3) &&
    ["SRTF", "Priority", "MLQ", "MLFQ"].includes(algorithm);

  let ctxSwitches = 0;
  for (let i = 1; i < gantt.length; i++) {
    if (gantt[i].processId !== gantt[i - 1].processId) {
      ctxSwitches++;
    }
  }

  const totalTime =
    gantt.length > 0
      ? (gantt[gantt.length - 1].endTime ?? 0) - (gantt[0].startTime ?? 0)
      : 0;

  const switchesPerUnit = totalTime > 0 ? ctxSwitches / totalTime : 0;

  const highCtx =
    ["RR", "SRTF", "MLQ", "MLFQ"].includes(algorithm) &&
    switchesPerUnit > 0.6;

  const patternLines: string[] = [];

  if (convoy) {
    patternLines.push(
      "There are signs of a convoy effect caused by a long-running job at the front."
    );
  }

  if (starvation) {
    patternLines.push(
      "Some processes appear to suffer from starvation under this policy."
    );
  }

  if (highCtx) {
    patternLines.push("Frequent context switching suggests higher CPU overhead.");
  }

  if (patternLines.length === 0) {
    patternLines.push(
      "No extreme convoy, starvation, or context-switching patterns detected."
    );
  }

  const tuningLines: string[] = [];

  if (algorithm === "RR") {
    tuningLines.push(
      `Adjust time quantum (${timeQuantum}) to balance responsiveness and overhead.`
    );
  } else if (algorithm === "MLFQ") {
    tuningLines.push(
      `Tune queue quantums (${mlqConfig?.q1TimeQuantum}/${mlqConfig?.q2TimeQuantum}) to balance responsiveness vs throughput.`
    );
  } else if (algorithm === "MLQ") {
    tuningLines.push(
      "Adjust queue assignments to control priority dominance and prevent starvation."
    );
  } else {
    tuningLines.push(
      "Compare with SRTF, RR, MLQ, or MLFQ to evaluate trade-offs."
    );
  }

  return [
    `This schedule uses ${algorithm} on ${processes.length} process(es).`,
    "",
    "Why some processes wait longer:",
    ...highWaitLines,
    "",
    "Detected patterns:",
    ...patternLines,
    "",
    "Tuning suggestions:",
    ...tuningLines,
  ].join("\n");
}

async function fetchGeminiWithRetry(
  url: string,
  body: Record<string, unknown>,
  retries = 1,
  delayMs = 5000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 429 && i < retries - 1) {
      console.log(
        `⏳ [Insights] Rate limited. Retrying in ${delayMs}ms... (attempt ${i + 1}/${retries})`
      );
      await new Promise((res) => setTimeout(res, delayMs));
      delayMs *= 2; // exponential backoff: 15s → 30s → 60s
      continue;
    }

    return response;
  }

  throw new Error("Max retries reached");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InsightsBody;
    const { algorithm, timeQuantum, mlqConfig, processes, results } = body;

    // Check cache first
    const cacheKey = hashBody(body);
    const cached = insightsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log("💾 [Insights] Returning cached result. Skipping Gemini call.");
      return NextResponse.json({ insights: cached.insights });
    }

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.log("🚫 [Insights] No API key found. Using heuristic fallback.");
      return NextResponse.json({
        insights: buildHeuristicInsights(body),
      });
    }

    console.log("🔑 [Insights] API key found. Calling Gemini LLM...");

    const prompt = `
You are an Operating Systems professor.

Return EXACTLY 6 bullet points.

Rules:
- Each line must start with "- "
- Each bullet must be under 18 words.
- No headers.
- No paragraphs.
- No explanations outside bullets.

Cover:
- High waiting time reason
- Convoy effect (if present)
- Starvation (if present)
- Context switching overhead
- One tuning suggestion for ${algorithm}

Schedule Data:
${JSON.stringify({ algorithm, timeQuantum, mlqConfig, processes, results })}
`;
    const response = await fetchGeminiWithRetry(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey),
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 5000,
        },
      }
    );

    if (!response.ok) {
      console.log(
        `❌ [Insights] Gemini API error: ${response.status} ${response.statusText}. Falling back to heuristic.`
      );
      return NextResponse.json({
        insights: buildHeuristicInsights(body),
      });
    }

    const data = await response.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const llmInsights =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("\n")
        .trim() || "";

    if (llmInsights.length > 0) {
      console.log("✅ [Insights] Response successfully generated by Gemini LLM.");
      insightsCache.set(cacheKey, { insights: llmInsights, timestamp: Date.now() });
      return NextResponse.json({ insights: llmInsights });
    } else {
      console.log(
        "⚠️ [Insights] Gemini returned empty response. Falling back to heuristic."
      );
      return NextResponse.json({ insights: buildHeuristicInsights(body) });
    }
  } catch (error) {
    console.error("💥 [Insights] Unexpected error:", error);
    return NextResponse.json({
      insights: buildHeuristicInsights(null),
    });
  }
}