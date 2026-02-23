'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';

export function AskSchedbotBanner() {
  const { processes, algorithm, timeQuantum, mlqConfig, results } = useStore();
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPayload = () => ({
    algorithm,
    timeQuantum,
    mlqConfig: {
      q1TimeQuantum: mlqConfig.q1TimeQuantum,
      q2TimeQuantum: mlqConfig.q2TimeQuantum,
    },
    processes: processes.map((p) => ({
      id: p.id,
      burstTime: p.burstTime,
      arrivalTime: p.arrivalTime,
      priority: p.priority,
    })),
    results: results
      ? {
          metrics: results.metrics.map((m) => ({
            processId: m.processId,
            waitingTime: m.waitingTime,
            turnaroundTime: m.turnaroundTime,
            responseTime: m.responseTime,
          })),
          ganttChart: results.ganttChart.map((b) => ({
            processId: b.processId,
            startTime: b.startTime,
            endTime: b.endTime,
          })),
        }
      : undefined,
  });

  const handleGetInsights = async () => {
    const payload = buildPayload();
    setLoading(true);
    setError(null);
    setInsights(null);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load insights');
      setInsights(data.insights ?? '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load insights. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(124,58,237,0.06)',
        border: '1px solid rgba(124,58,237,0.2)',
      }}
    >
      <div className="flex justify-between items-center px-5 py-4 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xl">🤖</span>
          <div>
            <p className="text-sm font-semibold text-white font-body">
              SchedBot can analyze this
            </p>
            <p className="text-xs text-slate-500 font-body">
              Get AI insights on your current simulation results
            </p>
          </div>
        </div>
        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 bg-gradient-to-r from-violet-600 to-violet-800 shadow-glow"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyzing…
            </>
          ) : insights ? (
            'Refresh insights'
          ) : (
            'Get AI insights →'
          )}
        </button>
      </div>

      {error && (
        <div className="px-5 pb-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {insights && !loading && (
        <div className="px-5 pb-4 pt-0">
          <div className="rounded-lg bg-schedos-surface border border-slate-700/80 p-4 text-sm text-slate-300 whitespace-pre-wrap font-body">
            {insights}
          </div>
        </div>
      )}
    </div>
  );
}
