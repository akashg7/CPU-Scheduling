"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Process } from "@/lib/types";

export const ProcessInput = () => {
    const { processes, addProcess, removeProcess } = useStore();
    const [newProcess, setNewProcess] = useState<Partial<Process>>({
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
    });

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
        } as Process);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-600 tracking-wider">Arrival</Label>
                    <Input
                        type="number"
                        min={0}
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="bg-white/80 border-slate-300 text-slate-800 h-10 focus-visible:ring-2 focus-visible:ring-purple-500/50 font-mono shadow-sm hover:border-purple-400 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-600 tracking-wider">Burst</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="bg-white/80 border-slate-300 text-slate-800 h-10 focus-visible:ring-2 focus-visible:ring-purple-500/50 font-mono shadow-sm hover:border-purple-400 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold text-slate-600 tracking-wider">Priority</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className="bg-white/80 border-slate-300 text-slate-800 h-10 focus-visible:ring-2 focus-visible:ring-purple-500/50 font-mono shadow-sm hover:border-purple-400 transition-colors"
                    />
                </div>
            </div>
            <Button onClick={handleAdd} className="w-full bg-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 text-slate-700 hover:text-white border border-slate-300 shadow-sm hover:shadow-md font-semibold h-10 transition-all duration-300 active:scale-[0.98]">
                <Plus className="w-4 h-4 mr-2" /> Add Process
            </Button>

            <div className="rounded-xl border border-slate-200 bg-white/60 max-h-[240px] overflow-auto shadow-inner backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                        <TableRow className="border-slate-200 hover:bg-slate-50">
                            <TableHead className="text-xs h-10 text-slate-700 uppercase tracking-wider font-bold">ID</TableHead>
                            <TableHead className="text-xs h-10 text-slate-700 uppercase tracking-wider font-bold">Arr</TableHead>
                            <TableHead className="text-xs h-10 text-slate-700 uppercase tracking-wider font-bold">Bur</TableHead>
                            <TableHead className="text-xs h-10 text-slate-700 uppercase tracking-wider font-bold">Pri</TableHead>
                            <TableHead className="text-xs h-10 w-[40px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processes.map((p) => (
                            <TableRow key={p.id} className="border-slate-200 hover:bg-purple-50/50 group transition-colors">
                                <TableCell className="py-2.5 text-sm font-semibold text-slate-800">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.color }}></span>
                                        {p.id}
                                    </div>
                                </TableCell>
                                <TableCell className="py-2.5 text-sm text-slate-600 font-mono">{p.arrivalTime}</TableCell>
                                <TableCell className="py-2.5 text-sm text-slate-600 font-mono">{p.burstTime}</TableCell>
                                <TableCell className="py-2.5 text-sm text-slate-600 font-mono">{p.priority}</TableCell>
                                <TableCell className="py-2.5 text-sm">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                        onClick={() => removeProcess(p.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
