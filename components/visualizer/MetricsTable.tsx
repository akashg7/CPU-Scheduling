"use client";

import { useStore } from "@/store/useStore";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const MetricsTable = () => {
    const { results, processes, currentTime } = useStore();
    const metrics = results?.metrics || [];

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border-2 border-dashed border-slate-800 bg-schedos-elevated/50">
                <div className="w-12 h-12 rounded-xl bg-schedos-surface border border-slate-700 flex items-center justify-center mb-2">
                    <span className="text-xl font-mono font-bold text-slate-500">Σ</span>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">No metrics yet</p>
                <p className="text-[10px] text-slate-600 max-w-[220px]">Add processes and run to see WT, TAT, CPU%.</p>
            </div>
        );
    }

    const avgWait = metrics.reduce((acc, m) => acc + m.waitingTime, 0) / Math.max(metrics.length, 1);
    const avgTurn = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / Math.max(metrics.length, 1);

    const totalBusy = results.ganttChart.reduce((acc, b) => acc + (b.endTime - b.startTime), 0);
    const util = currentTime > 0 ? Math.min((totalBusy / Math.max(currentTime, 1)) * 100, 100) : 0;

    const completedCount = metrics.filter(m => currentTime >= m.completionTime).length;
    const avgResponse = metrics.length
        ? metrics.reduce((acc, m) => acc + m.responseTime, 0) / metrics.length
        : 0;

    return (
        <div className="space-y-4">
            {/* Metric cards */}
            <div className="p-4 rounded-xl bg-schedos-elevated border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider block mb-1">Avg Waiting Time</span>
                <span className="text-2xl font-mono font-bold text-white">{avgWait.toFixed(2)}</span>
                <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-amber-500/80 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, avgWait * 10)}%` }} />
                </div>
            </div>
            <div className="p-4 rounded-xl bg-schedos-elevated border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-cyan-400/90 tracking-wider block mb-1">Avg Turnaround Time</span>
                <span className="text-2xl font-mono font-bold text-white">{avgTurn.toFixed(2)}</span>
                <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-cyan-500/80 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, avgTurn * 5)}%` }} />
                </div>
            </div>
            <div className="p-4 rounded-xl bg-schedos-elevated border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400/90 tracking-wider block mb-1">CPU Utilization</span>
                <span className="text-2xl font-mono font-bold text-white">{util.toFixed(0)}%</span>
                <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500/80 rounded-full transition-all duration-300" style={{ width: `${util}%` }} />
                </div>
            </div>
            <div className="p-4 rounded-xl bg-schedos-elevated border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-violet-400/90 tracking-wider block mb-1">Throughput</span>
                <span className="text-2xl font-mono font-bold text-white">{completedCount}<span className="text-sm text-slate-500">/{processes.length}</span></span>
            </div>
            <div className="p-4 rounded-xl bg-schedos-elevated border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-blue-400/90 tracking-wider block mb-1">Avg Response Time</span>
                <span className="text-2xl font-mono font-bold text-white">{avgResponse.toFixed(2)}</span>
            </div>

            {/* Process details table */}
            <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Process Details</span>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <Table>
                        <TableBody>
                            {metrics.map((m) => {
                                const p = processes.find(proc => proc.id === m.processId);
                                const isCompleted = currentTime >= m.completionTime;
                                return (
                                    <TableRow key={m.processId} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="py-2 font-medium text-slate-200 text-sm border-l-4" style={{ borderLeftColor: p?.color }}>
                                            {m.processId}
                                        </TableCell>
                                        <TableCell className="py-2 text-slate-400 font-mono text-xs">
                                            WT: {isCompleted ? m.waitingTime : "—"}
                                        </TableCell>
                                        <TableCell className="py-2 text-slate-400 font-mono text-xs">
                                            TAT: {isCompleted ? m.turnaroundTime : "—"}
                                        </TableCell>
                                        <TableCell className="py-2 text-slate-400 font-mono text-xs">
                                            CT: {isCompleted ? m.completionTime : "—"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
