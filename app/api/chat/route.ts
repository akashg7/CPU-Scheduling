import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SYSTEM = `You are SchedBot, a friendly expert in CPU scheduling algorithms. You help users understand FCFS, Round Robin, SJF, SRTF, Priority scheduling, and related concepts. Be concise, use plain English, and add an occasional emoji. When relevant, explain tradeoffs between algorithms (e.g., convoy effect in FCFS, starvation in SJF).`;

const SCHEDBOT_SYSTEM = `You are SchedBot, an expert AI assistant embedded in a CPU Scheduling Visualizer called Team 404.
Your job is to explain CPU scheduling algorithms clearly, analyze simulation results, and help students understand OS concepts.

You know about: FCFS, Round Robin, SJF (Shortest Job First), SRTF (Shortest Remaining Time First), Priority Scheduling (preemptive and non-preemptive), and Multilevel Queue (MLQ/MLFQ).

When given simulation data (processes, waiting times, turnaround times, algorithm used), analyze it and give specific, actionable insights.

Personality: Friendly, enthusiastic about OS concepts, uses emojis occasionally, explains tradeoffs clearly.
Keep answers concise but complete. Use bullet points for comparisons. Never be condescending.

If the user shares metrics or process data, analyze it specifically. Otherwise, explain concepts clearly with examples.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, system: customSystem, insights } = body as {
      messages: { role: string; content: string }[];
      system?: string;
      insights?: string;
    };
    const apiKey = process.env.ANTHROPIC_API_KEY;
    let systemPrompt = customSystem === "schedbot" ? SCHEDBOT_SYSTEM : customSystem || DEFAULT_SYSTEM;
    if (typeof insights === "string" && insights.trim()) {
      systemPrompt += "\n\nPre-computed schedule analysis (use this to inform your response):\n" + insights.trim();
    }

    if (!apiKey) {
      // If we have pre-computed insights (from /api/insights), return those so the user still gets AI performance analysis
      if (typeof insights === "string" && insights.trim()) {
        return NextResponse.json({ content: insights.trim() });
      }
      return NextResponse.json({
        content:
          "SchedBot is configured to use the Anthropic API. Add ANTHROPIC_API_KEY to your .env to enable live responses. Meanwhile: FCFS runs processes in arrival order; RR uses a time quantum; SJF picks the shortest job first; SRTF is preemptive SJF; Priority uses process priority. Try the simulator at /visualizer!",
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: (messages || []).map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", response.status, err);
      return NextResponse.json(
        { content: "SchedBot is temporarily unavailable. Try again in a moment." },
        { status: 200 }
      );
    }

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text =
      data.content?.find((c) => c.type === "text")?.text ?? "I couldn't generate a response.";

    return NextResponse.json({ content: text });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { content: "Something went wrong. Please try again." },
      { status: 200 }
    );
  }
}
