"use client";

import { useStore } from "@/store/useStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const MetricsTable = () => {
    const { results, processes, currentTime } = useStore();
    const metrics = results?.metrics || [];

    if (!results) {
        return <div className="text-center text-[#4B5563] py-12 italic text-sm">Run simulation to view analysis</div>;
    }

    const avgWait = metrics.reduce((acc, m) => acc + m.waitingTime, 0) / Math.max(metrics.length, 1);
    const avgTurn = metrics.reduce((acc, m) => acc + m.turnaroundTime, 0) / Math.max(metrics.length, 1);

    const totalBusy = results.ganttChart.reduce((acc, b) => acc + (b.endTime - b.startTime), 0);
    const util = currentTime > 0 ? Math.min((totalBusy / Math.max(currentTime, 1)) * 100, 100) : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
                <div className="rounded-xl border border-[#232838] overflow-hidden bg-black">
                    <Table>
                        <TableHeader className="bg-black border-b border-[#232838]">
                            <TableRow className="border-[#232838] hover:bg-[#161A22]">
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider h-10">Process</TableHead>
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider text-right h-10">Arrival</TableHead>
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider text-right h-10">Burst</TableHead>
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider text-right h-10">Finish</TableHead>
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider text-right h-10">Turnaround</TableHead>
                                <TableHead className="text-[#6B7280] font-bold uppercase text-[10px] tracking-wider text-right h-10">Waiting</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.map((m) => {
                                const p = processes.find(proc => proc.id === m.processId);
                                const isCompleted = currentTime >= m.completionTime;

                                return (
                                    <TableRow key={m.processId} className="border-[#1F2430] hover:bg-black transition-colors">
                                        <TableCell className="font-medium text-[#E5E7EB] py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p?.color }}></span>
                                                {m.processId}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-[#9CA3AF] font-mono text-xs py-3">{p?.arrivalTime}</TableCell>
                                        <TableCell className="text-right text-[#9CA3AF] font-mono text-xs py-3">{p?.burstTime}</TableCell>
                                        <TableCell className="text-right text-[#9CA3AF] font-mono text-xs py-3">
                                            {isCompleted ? m.completionTime : <span className="text-[#4B5563]">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-[#E5E7EB] text-xs font-medium py-3">
                                            {isCompleted ? m.turnaroundTime : <span className="text-[#4B5563]">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-[#E5E7EB] text-xs font-medium py-3">
                                            {isCompleted ? m.waitingTime : <span className="text-[#4B5563]">-</span>}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <TableRow className="bg-black border-t-2 border-[#232838]">
                                <TableCell colSpan={4} className="text-right bg-black text-[#9CA3AF] text-[10px] uppercase tracking-wider font-bold h-12">Average</TableCell>
                                <TableCell className="text-right text-[#10B981] bg-black font-mono font-bold text-sm h-12">{avgTurn.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-[#3B82F6] bg-black font-mono font-bold text-sm h-12">{avgWait.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
                <div className="p-5 rounded-xl bg-black border border-[#232838] space-y-3">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-widest block">CPU Utilization</span>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-light text-[#E5E7EB]">{util.toFixed(0)}<span className="text-base text-[#6B7280] ml-1">%</span></span>
                    </div>
                    <div className="h-1 w-full bg-[#1F2430] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${util}%` }}></div>
                    </div>
                </div>

                <div className="p-5 rounded-xl bg-black border border-[#232838] space-y-3">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-widest block">Throughput</span>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-light text-[#E5E7EB]">
                            {metrics.filter(m => currentTime >= m.completionTime).length}
                            <span className="text-base text-[#6B7280] mx-1">/</span>
                            <span className="text-base text-[#6B7280]">{processes.length}</span>
                        </span>
                    </div>
                    <div className="text-[10px] text-[#4B5563]">Processes completed</div>
                </div>
            </div>
        </div>
    );
};
