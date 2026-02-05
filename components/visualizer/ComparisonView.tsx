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
        <div className="space-y-6">
            <Card className="bg-black border-[#232838] shadow-sm rounded-xl">
                <CardHeader className="pb-4 border-b border-[#232838]">
                    <CardTitle className="text-[#9CA3AF] text-xs uppercase tracking-widest font-semibold">Algorithm Benchmark</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-[#232838] hover:bg-[#161A22]">
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider h-12">Algorithm</TableHead>
                                <TableHead className="text-right text-[#6B7280] font-bold uppercase text-[10px] tracking-wider h-12">Avg Waiting</TableHead>
                                <TableHead className="text-right text-[#6B7280] font-bold uppercase text-[10px] tracking-wider h-12">Avg Turnaround</TableHead>
                                <TableHead className="text-right text-[#6B7280] font-bold uppercase text-[10px] tracking-wider h-12">Makespan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((d) => (
                                <TableRow key={d.algo} className="border-[#1F2430] hover:bg-[#1C2029] transition-colors">
                                    <TableCell className="font-medium text-[#E5E7EB] py-3">{d.algo}</TableCell>
                                    <TableCell className="text-right text-[#3B82F6] font-mono font-medium py-3">{d.avgWait.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-[#10B981] font-mono font-medium py-3">{d.avgTurn.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-[#9CA3AF] font-mono py-3">{d.maxComp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black border-[#232838] shadow-sm rounded-xl">
                    <CardHeader className="pb-4 border-b border-[#232838]">
                        <CardTitle className="text-[#9CA3AF] text-xs uppercase tracking-widest font-semibold">Waiting Time Visualization</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            {data.map(d => (
                                <div key={d.algo} className="space-y-2">
                                    <div className="flex justify-between text-xs text-[#9CA3AF]">
                                        <span className="font-medium">{d.algo}</span>
                                        <span className="font-mono text-[#E5E7EB]">{d.avgWait.toFixed(2)}</span>
                                    </div>
                                    <div className="h-1.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#232838]">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${(d.avgWait / maxWait) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black border-[#232838] shadow-sm rounded-xl">
                    <CardHeader className="pb-4 border-b border-[#232838]">
                        <CardTitle className="text-[#9CA3AF] text-xs uppercase tracking-widest font-semibold">Turnaround Time Visualization</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-5">
                            {data.map(d => (
                                <div key={d.algo} className="space-y-2">
                                    <div className="flex justify-between text-xs text-[#9CA3AF]">
                                        <span className="font-medium">{d.algo}</span>
                                        <span className="font-mono text-[#E5E7EB]">{d.avgTurn.toFixed(2)}</span>
                                    </div>
                                    <div className="h-1.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#232838]">
                                        <div
                                            className="h-full bg-emerald-600 rounded-full"
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
