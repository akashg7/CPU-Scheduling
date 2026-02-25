"use client";

import { useStore } from "@/store/useStore";
import { runSimulation } from "@/lib/runner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlgorithmType } from "@/lib/types";

export const ComparisonView = () => {
    const { processes, timeQuantum, mlqConfig } = useStore();

    const algorithms: AlgorithmType[] = ['FCFS', 'SJF', 'SRTF', 'Priority', 'RR', 'MLQ', 'MLFQ'];

    const data = algorithms.map(algo => {
        const result = runSimulation(algo, processes, { timeQuantum, mlqConfig });
        const avgWait = result.metrics.reduce((acc, m) => acc + m.waitingTime, 0) / Math.max(result.metrics.length, 1);
        const avgTurn = result.metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / Math.max(result.metrics.length, 1);
        const maxComp = Math.max(...result.metrics.map(m => m.completionTime), 0);

        return { algo, avgWait, avgTurn, maxComp };
    });

    const maxWait = Math.max(...data.map(d => d.avgWait), 1);
    const maxTurn = Math.max(...data.map(d => d.avgTurn), 1);
    const bestWait = data.length ? data.reduce((a, b) => (a.avgWait <= b.avgWait ? a : b)) : null;
    const bestTurn = data.length ? data.reduce((a, b) => (a.avgTurn <= b.avgTurn ? a : b)) : null;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 px-3 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-indigo-800 dark:text-indigo-300">Legend:</span>
                <span className="ml-2">Waiting time = time spent in ready queue before first run.</span>
                <span className="mx-2 text-slate-400 dark:text-slate-500">·</span>
                <span>Turnaround time = completion time − arrival time. Lower is better.</span>
            </div>

            <Card className="glass-card shadow-lg border-slate-200/50 dark:border-slate-700/50 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-600">
                    <CardTitle className="text-slate-700 dark:text-slate-100 text-xs sm:text-sm uppercase tracking-wider font-bold">Algorithm Benchmark — same processes, different algorithms</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 overflow-x-auto">
                    <Table className="min-w-[420px]">
                        <TableHeader>
                            <TableRow className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <TableHead className="text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider h-11">Algorithm</TableHead>
                                <TableHead className="text-right text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider h-11">Avg Waiting</TableHead>
                                <TableHead className="text-right text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider h-11">Avg Turnaround</TableHead>
                                <TableHead className="text-right text-slate-700 dark:text-slate-300 font-bold uppercase text-xs tracking-wider h-11">Makespan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((d) => (
                                <TableRow
                                    key={d.algo}
                                    className={`border-slate-200 dark:border-slate-600 transition-colors ${d.algo === bestWait?.algo || d.algo === bestTurn?.algo
                                            ? "bg-indigo-50/70 dark:bg-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/40"
                                            : "hover:bg-purple-50/30 dark:hover:bg-slate-700/30"
                                        }`}
                                >
                                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200 py-3.5">
                                        <span className="flex items-center gap-2">
                                            {d.algo}
                                            {d.algo === bestWait?.algo && d.algo === bestTurn?.algo && (
                                                <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">Best</span>
                                            )}
                                            {d.algo === bestWait?.algo && d.algo !== bestTurn?.algo && (
                                                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">Best wait</span>
                                            )}
                                            {d.algo === bestTurn?.algo && d.algo !== bestWait?.algo && (
                                                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">Best turn</span>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right text-blue-600 dark:text-blue-400 font-mono font-semibold py-3.5 text-sm">{d.avgWait.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-mono font-semibold py-3.5 text-sm">{d.avgTurn.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-slate-600 dark:text-slate-400 font-mono py-3.5 text-sm">{d.maxComp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card shadow-lg border-slate-200/50 dark:border-slate-700/50 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-600">
                        <CardTitle className="text-slate-700 dark:text-slate-100 text-sm uppercase tracking-wider font-bold">Waiting Time — lower is better</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            {data.map(d => (
                                <div key={d.algo} className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span className="font-semibold">{d.algo}</span>
                                        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{d.avgWait.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                            style={{ width: `${(d.avgWait / maxWait) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card shadow-lg border-slate-200/50 dark:border-slate-700/50 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-600">
                        <CardTitle className="text-slate-700 dark:text-slate-100 text-sm uppercase tracking-wider font-bold">Turnaround Time — lower is better</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            {data.map(d => (
                                <div key={d.algo} className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span className="font-semibold">{d.algo}</span>
                                        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{d.avgTurn.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                                            style={{ width: `${(d.avgTurn / maxTurn) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
