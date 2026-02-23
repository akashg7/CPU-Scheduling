"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Activity, AlertTriangle } from "lucide-react";
import { AlgorithmType, SimulationMetric, ScheduledBlock, Process } from "@/lib/types";

interface DetectedPatterns {
  convoy: boolean;
  starvation: boolean;
  highContextSwitching: boolean;
}

interface InsightSummary {
  highWaitMessages: string[];
  patternMessages: string[];
  tuningSuggestions: string[];
}

function analyzePatterns(
  algorithm: AlgorithmType,
  metrics: SimulationMetric[],
  gantt: ScheduledBlock[],
  processes: Process[]
): { patterns: DetectedPatterns; summary: InsightSummary } {
  const avgWait =
    metrics.reduce((acc, m) => acc + m.waitingTime, 0) / Math.max(metrics.length, 1);

  const highWait = metrics.filter((m) => m.waitingTime > avgWait * 1.5);

  const highWaitMessages = highWait.map((m) => {
    const p = processes.find((proc) => proc.id === m.processId);
    const factor = avgWait > 0 ? (m.waitingTime / avgWait).toFixed(2) : "—";
    const reasonHints: string[] = [];

    if (p) {
      if (p.burstTime > 2 * (metrics.reduce((acc, mm) => acc + (processes.find(pp => pp.id === mm.processId)?.burstTime ?? 0), 0) / Math.max(processes.length, 1))) {
        reasonHints.push("its burst time is much longer than most others");
      }
      if (algorithm === "SJF" || algorithm === "SRTF") {
        reasonHints.push("shorter jobs kept jumping ahead under the shortest-job policy");
      }
      if (algorithm === "Priority" && p.priority > 1) {
        reasonHints.push("higher-priority processes kept preempting it");
      }
      if ((algorithm === "MLQ" || algorithm === "MLFQ") && p.queueLevel === 3) {
        reasonHints.push("it is in the lowest-priority batch queue");
      }
    }

    const reason =
      reasonHints.length > 0
        ? ` Likely because ${reasonHints.join(" and ")}.`
        : "";

    return `Process ${m.processId} waited ${m.waitingTime.toFixed(
      1
    )} time units, about ${factor}× the average waiting time.${reason}`;
  });

  // Convoy effect: one long job at the front while many others queue behind
  let convoy = false;
  if (gantt.length > 0 && (algorithm === "FCFS" || algorithm === "SJF" || algorithm === "Priority")) {
    const first = gantt[0];
    const firstProc = processes.find((p) => p.id === first.processId);
    if (firstProc) {
      const avgBurst =
        processes.reduce((acc, p) => acc + p.burstTime, 0) / Math.max(processes.length, 1);
      if (firstProc.burstTime > avgBurst * 2) {
        const othersArrivedDuring = processes.filter(
          (p) =>
            p.id !== firstProc.id &&
            p.arrivalTime >= first.startTime &&
            p.arrivalTime < first.endTime
        );
        if (othersArrivedDuring.length >= 2) {
          convoy = true;
        }
      }
    }
  }

  // Starvation: some processes wait far longer than average
  const starvation =
    metrics.some((m) => m.waitingTime > avgWait * 3) &&
    (algorithm === "SRTF" || algorithm === "Priority" || algorithm === "MLQ" || algorithm === "MLFQ");

  // Context switching: count consecutive blocks where processId changes
  let ctxSwitches = 0;
  for (let i = 1; i < gantt.length; i++) {
    if (gantt[i].processId !== gantt[i - 1].processId) {
      ctxSwitches++;
    }
  }
  const totalTime =
    gantt.length > 0 ? gantt[gantt.length - 1].endTime - gantt[0].startTime : 0;
  const switchesPerUnit = totalTime > 0 ? ctxSwitches / totalTime : 0;
  const highContextSwitching =
    (algorithm === "RR" || algorithm === "SRTF" || algorithm === "MLQ" || algorithm === "MLFQ") &&
    switchesPerUnit > 0.6;

  const patternMessages: string[] = [];
  if (convoy) {
    patternMessages.push(
      "Detected a convoy effect: one long-running process at the front forced several others to wait behind it."
    );
  }
  if (starvation) {
    patternMessages.push(
      "Some processes exhibit starvation-like behavior, waiting much longer than the others before getting CPU time."
    );
  }
  if (highContextSwitching) {
    patternMessages.push(
      "The schedule shows frequent context switches, which would add overhead on a real CPU."
    );
  }

  const tuningSuggestions: string[] = [];

  if (algorithm === "RR") {
    if (highContextSwitching) {
      tuningSuggestions.push(
        "Time quantum looks quite small for this workload — try increasing it slightly to reduce context switching overhead."
      );
    } else if (avgWait > 0 && avgWait > totalTime * 0.4) {
      tuningSuggestions.push(
        "Many processes are waiting a long time; try reducing the time quantum so shorter jobs get CPU sooner and improve response time."
      );
    } else {
      tuningSuggestions.push(
        "For Round Robin, experiment with a slightly smaller quantum if you care about responsiveness, or a slightly larger one if you care about throughput."
      );
    }
  }

  if (algorithm === "MLFQ") {
    tuningSuggestions.push(
      "If interactive tasks feel slow, reduce the Q1/Q2 time quantums or enable stronger feedback so CPU‑hungry batch jobs fall to lower queues faster."
    );
    if (starvation) {
      tuningSuggestions.push(
        "Starvation hints that aging may need to be enabled or the aging threshold lowered so long-waiting tasks get promoted sooner."
      );
    }
  }

  if (convoy && (algorithm === "FCFS" || algorithm === "Priority")) {
    tuningSuggestions.push(
      "The convoy effect suggests trying a preemptive algorithm like SRTF or Round Robin so short jobs are not forced to wait behind very long ones."
    );
  }

  if (tuningSuggestions.length === 0) {
    tuningSuggestions.push(
      "Current parameters look fairly balanced for this workload; try changing the algorithm or time quantum to explore different trade-offs."
    );
  }

  return {
    patterns: { convoy, starvation, highContextSwitching },
    summary: { highWaitMessages, patternMessages, tuningSuggestions },
  };
}

export const InsightsPanel = () => {
  const { results, processes, algorithm, timeQuantum, mlqConfig, totalDuration } = useStore();

  const analysis = useMemo(() => {
    if (!results || processes.length === 0 || results.metrics.length === 0) {
      return null;
    }
    return analyzePatterns(algorithm, results.metrics, results.ganttChart, processes);
  }, [algorithm, processes, results]);

  if (!results || !analysis) {
    return null;
  }

  const { patterns, summary } = analysis;

  return (
    <Card className="glass-card shadow-lg border-slate-200/60 dark:border-slate-700/60 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-300" />
          <div>
            <CardTitle className="text-slate-800 dark:text-slate-100 text-base">
              AI Performance Insights
            </CardTitle>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Natural-language explanation of why this schedule behaves the way it does.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[11px] font-mono uppercase tracking-wider border-amber-300/60 dark:border-amber-500/60 text-amber-700 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/40"
        >
          t = {totalDuration.toFixed ? totalDuration.toFixed(1) : totalDuration}s
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Why some processes waited longer
          </p>
          {summary.highWaitMessages.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Waiting times are fairly even across processes; no single process stands out as heavily
              penalized.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {summary.highWaitMessages.map((msg, i) => (
                <li key={i} className="leading-snug">
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Detected patterns in the schedule
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={patterns.convoy ? "default" : "outline"}
              className="flex items-center gap-1 text-[11px]"
            >
              <Activity className="w-3 h-3" />
              Convoy Effect
            </Badge>
            <Badge
              variant={patterns.starvation ? "default" : "outline"}
              className="flex items-center gap-1 text-[11px]"
            >
              <AlertTriangle className="w-3 h-3" />
              Starvation Risk
            </Badge>
            <Badge
              variant={patterns.highContextSwitching ? "default" : "outline"}
              className="flex items-center gap-1 text-[11px]"
            >
              <Activity className="w-3 h-3" />
              High Context Switching
            </Badge>
          </div>
          {summary.patternMessages.length > 0 && (
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mt-1">
              {summary.patternMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Parameter tuning suggestions
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {summary.tuningSuggestions.map((msg, i) => (
              <li key={i}>• {msg}</li>
            ))}
            {algorithm === "RR" && (
              <li className="text-[11px] text-slate-500 dark:text-slate-400">
                Tip: try changing the time quantum from {timeQuantum} to values like{" "}
                {Math.max(1, timeQuantum - 1)} or {timeQuantum + 1} and observe how response time and
                context switching change.
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

