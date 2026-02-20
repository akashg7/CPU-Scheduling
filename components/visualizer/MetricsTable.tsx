"use client";

import { useStore } from "@/store/useStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const MetricsTable = () => {
    const { results, processes, currentTime } = useStore();
    const metrics = results?.metrics || [];

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center mb-3 shadow-sm">
                    <span className="text-2xl font-mono font-bold text-slate-300 dark:text-slate-500">Σ</span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">No metrics yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 max-w-[240px]">Add at least one process and run a simulation to see waiting time, turnaround time, and CPU utilization.</p>
            </div>
        );
    }

    const avgWait = metrics.reduce((acc, m) => acc + m.waitingTime, 0) / Math.max(metrics.length, 1);
    const avgTurn = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / Math.max(metrics.length, 1);

    const totalBusy = results.ganttChart.reduce((acc, b) => acc + (b.endTime - b.startTime), 0);
    const util = currentTime > 0 ? Math.min((totalBusy / Math.max(currentTime, 1)) * 100, 100) : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-600 overflow-hidden bg-white/80 dark:bg-slate-800/80 shadow-sm backdrop-blur-sm">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-600">
                            <TableRow className="border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider h-11">Process</TableHead>
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider text-right h-11">Arrival</TableHead>
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider text-right h-11">Burst</TableHead>
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider text-right h-11">Finish</TableHead>
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider text-right h-11">Turnaround</TableHead>
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider text-right h-11">Waiting</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.map((m) => {
                                const p = processes.find(proc => proc.id === m.processId);
                                const isCompleted = currentTime >= m.completionTime;

                                return (
                                    <TableRow key={m.processId} className="border-slate-200 dark:border-slate-600 hover:bg-purple-50/30 dark:hover:bg-slate-700/50 transition-colors">
                                        <TableCell className="font-semibold text-slate-800 dark:text-slate-200 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/20" style={{ backgroundColor: p?.color }}></span>
                                                {m.processId}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-600 dark:text-slate-400 font-mono text-sm py-3.5">{p?.arrivalTime}</TableCell>
                                        <TableCell className="text-right text-slate-600 dark:text-slate-400 font-mono text-sm py-3.5">{p?.burstTime}</TableCell>
                                        <TableCell className="text-right text-slate-600 dark:text-slate-400 font-mono text-sm py-3.5">
                                            {isCompleted ? m.completionTime : <span className="text-slate-400 dark:text-slate-500">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-800 dark:text-slate-200 text-sm font-semibold py-3.5">
                                            {isCompleted ? m.turnaroundTime : <span className="text-slate-400 dark:text-slate-500">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-slate-800 dark:text-slate-200 text-sm font-semibold py-3.5">
                                            {isCompleted ? m.waitingTime : <span className="text-slate-400 dark:text-slate-500">-</span>}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow className="bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-600">
                                <TableCell colSpan={4} className="text-right bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider font-bold h-14">Average</TableCell>
                                <TableCell className="text-right text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800/80 font-mono font-bold text-base h-14">{avgTurn.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/80 font-mono font-bold text-base h-14">{avgWait.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-slate-200 dark:border-slate-600 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-xs uppercase font-bold text-slate-600 dark:text-slate-400 tracking-widest block">CPU Utilization — % of time CPU was busy</span>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-light text-slate-800 dark:text-slate-100">{util.toFixed(0)}<span className="text-lg text-slate-500 dark:text-slate-400 ml-1">%</span></span>
                    </div>
                    <div className="h-2 w-full bg-white/60 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 shadow-sm" style={{ width: `${util}%` }}></div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 border border-slate-200 dark:border-slate-600 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-xs uppercase font-bold text-slate-600 dark:text-slate-400 tracking-widest block">Throughput — processes completed so far</span>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-light text-slate-800 dark:text-slate-100">
                            {metrics.filter(m => currentTime >= m.completionTime).length}
                            <span className="text-lg text-slate-500 dark:text-slate-400 mx-1">/</span>
                            <span className="text-lg text-slate-500 dark:text-slate-400">{processes.length}</span>
                        </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Processes completed</div>
                </div>
            </div>
        </div>
    );
};
