"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Cpu } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Process } from "@/lib/types";

const QUEUE_LABELS: Record<number, string> = { 1: "Q1", 2: "Q2", 3: "Q3" };
const QUEUE_COLORS: Record<number, string> = { 1: "bg-red-500", 2: "bg-amber-500", 3: "bg-emerald-500" };

export const ProcessInput = () => {
    const { processes, addProcess, removeProcess, updateProcess, algorithm } = useStore();
    const [newProcess, setNewProcess] = useState<Partial<Process>>({
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
        queueLevel: 1,
    });

    const isMLQ = algorithm === 'MLQ' || algorithm === 'MLFQ';

    const handleAdd = () => {
        const id = `P${processes.length + 1}`;
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
        const color = colors[processes.length % colors.length];

        addProcess({
            id,
            arrivalTime: Number(newProcess.arrivalTime),
            burstTime: Number(newProcess.burstTime),
            priority: Number(newProcess.priority),
            color,
            queueLevel: (Number(newProcess.queueLevel) || 3) as 1 | 2 | 3,
        } as Process);
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Arrival = when the process arrives; Burst = CPU time needed; Priority = lower number = higher priority (for Priority / SRTF).
                {isMLQ && " Queue = which MLQ tier (Q1=System, Q2=Interactive, Q3=Batch)."}
            </p>
            <div className={`grid ${isMLQ ? 'grid-cols-4' : 'grid-cols-3'} gap-3`}>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Arrival</Label>
                    <Input
                        type="number"
                        min={0}
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-mono shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Burst</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-mono shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Priority</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 focus-visible:ring-2 focus-visible:ring-indigo-500/50 font-mono shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                    />
                </div>
                {isMLQ && (
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Queue</Label>
                        <Select
                            value={String(newProcess.queueLevel ?? 3)}
                            onValueChange={(v) => setNewProcess({ ...newProcess, queueLevel: Number(v) as 1 | 2 | 3 })}
                        >
                            <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 shadow-sm focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl">
                                <SelectItem value="1">Q1 — System</SelectItem>
                                <SelectItem value="2">Q2 — Interactive</SelectItem>
                                <SelectItem value="3">Q3 — Batch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <Button onClick={handleAdd} className="w-full bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-slate-700 dark:text-slate-200 hover:text-white border border-slate-300 dark:border-slate-600 shadow-sm hover:shadow-md font-semibold h-10 transition-all duration-300 active:scale-[0.98]">
                <Plus className="w-4 h-4 mr-2" /> Add Process
            </Button>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50 max-h-[240px] overflow-auto shadow-inner backdrop-blur-sm">
                {processes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center mb-3">
                            <Cpu className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">No processes yet</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 max-w-[200px]">Add arrival time, burst time and priority above, then click Add Process.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
                            <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <TableHead className="text-xs h-10 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">ID</TableHead>
                                <TableHead className="text-xs h-10 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Arr</TableHead>
                                <TableHead className="text-xs h-10 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Bur</TableHead>
                                <TableHead className="text-xs h-10 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Pri</TableHead>
                                {isMLQ && <TableHead className="text-xs h-10 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Queue</TableHead>}
                                <TableHead className="text-xs h-10 w-[40px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {processes.map((p) => (
                                <TableRow key={p.id} className="border-slate-200 dark:border-slate-700 hover:bg-purple-50/50 dark:hover:bg-slate-700/50 group transition-colors">
                                    <TableCell className="py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/20" style={{ backgroundColor: p.color }}></span>
                                            {p.id}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2.5 text-sm text-slate-600 dark:text-slate-400 font-mono">{p.arrivalTime}</TableCell>
                                    <TableCell className="py-2.5 text-sm text-slate-600 dark:text-slate-400 font-mono">{p.burstTime}</TableCell>
                                    <TableCell className="py-2.5 text-sm text-slate-600 dark:text-slate-400 font-mono">{p.priority}</TableCell>
                                    {isMLQ && (
                                        <TableCell className="py-2.5 text-sm">
                                            <Select
                                                value={String(p.queueLevel ?? 3)}
                                                onValueChange={(v) => updateProcess(p.id, { queueLevel: Number(v) as 1 | 2 | 3 })}
                                            >
                                                <SelectTrigger className="h-7 text-xs bg-transparent border-slate-300 dark:border-slate-600 w-20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xl rounded-lg">
                                                    <SelectItem value="1">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${QUEUE_COLORS[1]}`}></span>
                                                            {QUEUE_LABELS[1]}
                                                        </span>
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${QUEUE_COLORS[2]}`}></span>
                                                            {QUEUE_LABELS[2]}
                                                        </span>
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${QUEUE_COLORS[3]}`}></span>
                                                            {QUEUE_LABELS[3]}
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    )}
                                    <TableCell className="py-2.5 text-sm">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={() => removeProcess(p.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};
