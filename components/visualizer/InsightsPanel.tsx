"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, RefreshCw, Loader2 } from "lucide-react";

interface InsightsResponse {
  insights: string;
}

export const InsightsPanel = () => {
  const { results, processes, algorithm, timeQuantum, mlqConfig, totalDuration } = useStore();

  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // Reset insights when results change so the user can request fresh ones
  useEffect(() => {
    if (!results || processes.length === 0 || results.metrics.length === 0) {
      setInsights(null);
      setError(null);
    }
  }, [results, processes]);

  const fetchInsights = useCallback(async () => {
    if (!results || processes.length === 0 || results.metrics.length === 0) return;

    // Abort any in-flight request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithm,
          timeQuantum,
          mlqConfig,
          processes,
          results,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: InsightsResponse = await res.json();
      setInsights(data.insights);
    } catch {
      if (!controller.signal.aborted) {
        setError("Could not load AI insights. Try again after a moment.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [algorithm, timeQuantum, mlqConfig, processes, results]);

  if (!results) return null;

  const renderInsights = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Asking the LLM for an explanation of this schedule…
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-3">
          <p className="text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
          <Button
            onClick={fetchInsights}
            size="sm"
            variant="outline"
            className="gap-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      );
    }

    if (!insights) {
      return (
        <div className="flex flex-col items-center justify-center py-6 gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-500 dark:text-amber-300" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Ready to analyze your schedule
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click the button below to get AI-powered performance insights.
            </p>
          </div>
          <Button
            onClick={fetchInsights}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Get AI Suggestion
          </Button>
        </div>
      );
    }

    // Split response into individual bullet points
    const lines = insights
      .split(/\n|(?=•)|(?=- )|(?=\* )|(?=\d+\. )/)
      .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
      .filter((l) => l.length > 0);

    return (
      <div className="space-y-3">
        <ul className="space-y-2">
          {lines.map((line, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
          <Button
            onClick={fetchInsights}
            size="sm"
            variant="outline"
            className="gap-2 text-xs border-amber-300/60 dark:border-amber-500/60 text-amber-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh Insights
          </Button>
        </div>
      </div>
    );
  };

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
              Generated by a language model based on the current schedule.
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
      <CardContent className="space-y-3">
        {renderInsights()}
      </CardContent>
    </Card>
  );
};
