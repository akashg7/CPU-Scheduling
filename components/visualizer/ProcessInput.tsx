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
                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Arrival</Label>
                    <Input
                        type="number"
                        min={0}
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="bg-[#0F1115] border-[#232838] text-[#E5E7EB] h-9 focus-visible:ring-1 focus-visible:ring-blue-500/50 font-mono text-xs"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Burst</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="bg-[#0F1115] border-[#232838] text-[#E5E7EB] h-9 focus-visible:ring-1 focus-visible:ring-blue-500/50 font-mono text-xs"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Priority</Label>
                    <Input
                        type="number"
                        min={1}
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className="bg-[#0F1115] border-[#232838] text-[#E5E7EB] h-9 focus-visible:ring-1 focus-visible:ring-blue-500/50 font-mono text-xs"
                    />
                </div>
            </div>
            <Button onClick={handleAdd} className="w-full bg-black hover:bg-white hover:text-black text-[#E5E7EB] border border-[#232838] shadow-sm text-xs font-medium h-9 transition-all active:scale-[0.98]">
                <Plus className="w-3 h-3 mr-2" /> Add Process
            </Button>

            <div className="rounded-lg border border-[#232838] bg-black max-h-[220px] overflow-auto shadow-inner">
                <Table>
                    <TableHeader className="bg-[#161A22] sticky top-0 z-10">
                        <TableRow className="border-[#232838] hover:bg-[#161A22]">
                            <TableHead className="text-[10px] h-8 text-[#9CA3AF] uppercase tracking-wider font-bold">ID</TableHead>
                            <TableHead className="text-[10px] h-8 text-[#9CA3AF] uppercase tracking-wider font-bold">Arr</TableHead>
                            <TableHead className="text-[10px] h-8 text-[#9CA3AF] uppercase tracking-wider font-bold">Bur</TableHead>
                            <TableHead className="text-[10px] h-8 text-[#9CA3AF] uppercase tracking-wider font-bold">Pri</TableHead>
                            <TableHead className="text-[10px] h-8 w-[40px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processes.map((p) => (
                            <TableRow key={p.id} className="border-[#232838] hover:bg-[#1C2029] group">
                                <TableCell className="py-1.5 text-xs font-medium text-[#E5E7EB]">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                                        {p.id}
                                    </div>
                                </TableCell>
                                <TableCell className="py-1.5 text-xs text-[#9CA3AF] font-mono">{p.arrivalTime}</TableCell>
                                <TableCell className="py-1.5 text-xs text-[#9CA3AF] font-mono">{p.burstTime}</TableCell>
                                <TableCell className="py-1.5 text-xs text-[#9CA3AF] font-mono">{p.priority}</TableCell>
                                <TableCell className="py-1.5 text-xs">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 text-[#4B5563] hover:text-red-400 hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeProcess(p.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
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
