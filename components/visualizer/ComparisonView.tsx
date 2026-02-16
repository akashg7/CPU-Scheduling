"use client";

import { useStore } from "@/store/useStore";
import { runSimulation } from "@/lib/runner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlgorithmType } from "@/lib/types";

export const ComparisonView = () => {
    const { processes, timeQuantum } = useStore();

    const algorithms: AlgorithmType[] = ['FCFS', 'SJF', 'SRJF', 'Priority', 'RR'];

    const data = algorithms.map(algo => {
        const result = runSimulation(algo, processes, { timeQuantum });
        const avgWait = result.metrics.reduce((acc, m) => acc + m.waitingTime, 0) / Math.max(result.metrics.length, 1);
        const avgTurn = result.metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / Math.max(result.metrics.length, 1);
        const maxComp = Math.max(...result.metrics.map(m => m.completionTime), 0);

        return { algo, avgWait, avgTurn, maxComp };
    });

    const maxWait = Math.max(...data.map(d => d.avgWait), 1);
    const maxTurn = Math.max(...data.map(d => d.avgTurn), 1);

    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl border-slate-200/60 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 border-b border-slate-200">
                    <CardTitle className="text-slate-700 text-sm uppercase tracking-wider font-bold">Algorithm Benchmark</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-200 hover:bg-slate-50">
                                <TableHead className="text-slate-700 font-bold uppercase text-xs tracking-wider h-11">Algorithm</TableHead>
                                <TableHead className="text-right text-slate-700 font-bold uppercase text-xs tracking-wider h-11">Avg Waiting</TableHead>
                                <TableHead className="text-right text-slate-700 font-bold uppercase text-xs tracking-wider h-11">Avg Turnaround</TableHead>
                                <TableHead className="text-right text-slate-700 font-bold uppercase text-xs tracking-wider h-11">Makespan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((d) => (
                                <TableRow key={d.algo} className="border-slate-200 hover:bg-purple-50/30 transition-colors">
                                    <TableCell className="font-semibold text-slate-800 py-3.5">{d.algo}</TableCell>
                                    <TableCell className="text-right text-blue-600 font-mono font-semibold py-3.5 text-sm">{d.avgWait.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-emerald-600 font-mono font-semibold py-3.5 text-sm">{d.avgTurn.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-slate-600 font-mono py-3.5 text-sm">{d.maxComp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card shadow-xl border-slate-200/60 hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4 border-b border-slate-200">
                        <CardTitle className="text-slate-700 text-sm uppercase tracking-wider font-bold">Waiting Time Visualization</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            {data.map(d => (
                                <div key={d.algo} className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span className="font-semibold">{d.algo}</span>
                                        <span className="font-mono text-slate-800 font-semibold">{d.avgWait.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
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

                <Card className="glass-card shadow-xl border-slate-200/60 hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-4 border-b border-slate-200">
                        <CardTitle className="text-slate-700 text-sm uppercase tracking-wider font-bold">Turnaround Time Visualization</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            {data.map(d => (
                                <div key={d.algo} className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span className="font-semibold">{d.algo}</span>
                                        <span className="font-mono text-slate-800 font-semibold">{d.avgTurn.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
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
