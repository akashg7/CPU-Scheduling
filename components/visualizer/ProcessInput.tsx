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

import { AiProcessGenerator } from "./AiProcessGenerator";

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
            <AiProcessGenerator />
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Arrival = when the process arrives; Burst = CPU time needed; Priority = lower number = higher priority (for Priority / SRTF).
                {isMLQ && " Queue = which MLQ tier (Q1=System, Q2=Interactive, Q3=Batch)."}
            </p>
            <div className={`grid ${isMLQ ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'} gap-3`}>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Arrival</Label>
                    <Input
                        type="number"
                        min={0}
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="bg-schedos-elevated border-slate-700 text-slate-100 h-9 focus-visible:ring-2 focus-visible:ring-violet-500/50 font-mono text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Burst</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="bg-schedos-elevated border-slate-700 text-slate-100 h-9 focus-visible:ring-2 focus-visible:ring-violet-500/50 font-mono text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Priority</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className="bg-schedos-elevated border-slate-700 text-slate-100 h-9 focus-visible:ring-2 focus-visible:ring-violet-500/50 font-mono text-sm"
                    />
                </div>
                {isMLQ && (
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Queue</Label>
                        <Select
                            value={String(newProcess.queueLevel ?? 3)}
                            onValueChange={(v) => setNewProcess({ ...newProcess, queueLevel: Number(v) as 1 | 2 | 3 })}
                        >
                            <SelectTrigger className="bg-schedos-elevated border-slate-700 text-slate-100 h-9 focus:ring-2 focus:ring-violet-500/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-schedos-surface border-slate-700 shadow-xl rounded-xl">
                                <SelectItem value="1">Q1 — System</SelectItem>
                                <SelectItem value="2">Q2 — Interactive</SelectItem>
                                <SelectItem value="3">Q3 — Batch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <Button onClick={handleAdd} className="w-full bg-transparent hover:bg-violet-500/10 text-violet-400 border border-dashed border-violet-500/40 font-semibold h-9 transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add Process
            </Button>

            <div className="rounded-xl border border-slate-800 bg-schedos-elevated/80 max-h-[220px] overflow-auto">
                {processes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-schedos-surface border-2 border-dashed border-slate-700 flex items-center justify-center mb-2">
                            <Cpu className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 mb-1">No processes yet</p>
                        <p className="text-[10px] text-slate-600 max-w-[200px]">Add arrival, burst, priority, then click Add Process.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-schedos-surface sticky top-0 z-10">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-[10px] h-9 text-slate-500 uppercase tracking-wider font-bold">ID</TableHead>
                                <TableHead className="text-[10px] h-9 text-slate-500 uppercase tracking-wider font-bold">Arr</TableHead>
                                <TableHead className="text-[10px] h-9 text-slate-500 uppercase tracking-wider font-bold">Bur</TableHead>
                                <TableHead className="text-[10px] h-9 text-slate-500 uppercase tracking-wider font-bold">Pri</TableHead>
                                {isMLQ && <TableHead className="text-[10px] h-9 text-slate-500 uppercase tracking-wider font-bold">Queue</TableHead>}
                                <TableHead className="text-[10px] h-9 w-[36px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {processes.map((p) => (
                                <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/50 group transition-colors">
                                    <TableCell className="py-2 text-sm font-semibold text-slate-200">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: p.color }} />
                                            {p.id}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 text-xs text-slate-400 font-mono">{p.arrivalTime}</TableCell>
                                    <TableCell className="py-2 text-xs text-slate-400 font-mono">{p.burstTime}</TableCell>
                                    <TableCell className="py-2 text-xs text-slate-400 font-mono">{p.priority}</TableCell>
                                    {isMLQ && (
                                        <TableCell className="py-2.5 text-sm">
                                            <Select
                                                value={String(p.queueLevel ?? 3)}
                                                onValueChange={(v) => updateProcess(p.id, { queueLevel: Number(v) as 1 | 2 | 3 })}
                                            >
                                                <SelectTrigger className="h-7 text-xs bg-transparent border-slate-700 w-20 text-slate-300">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-schedos-surface border-slate-700 shadow-xl rounded-lg">
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
                                    <TableCell className="py-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
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
