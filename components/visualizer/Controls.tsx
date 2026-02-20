"use client";

import { useStore } from "@/store/useStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { AlgorithmType } from "@/lib/types";
import { Slider } from "@/components/ui/slider";

export const Controls = () => {
    const {
        algorithm, setAlgorithm,
        timeQuantum, setTimeQuantum,
        mlqConfig, setMLQConfig,
        isPlaying, togglePlayback,
        setCurrentTime, step,
        simulationSpeed, setSimulationSpeed
    } = useStore();

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
                <Label className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider">Algorithm — how the CPU picks the next process</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)}>
                    <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/50 h-10 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                        <SelectValue placeholder="Select Algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl">
                        <SelectItem value="FCFS" className="hover:bg-purple-50 dark:hover:bg-slate-700">First Come First Serve</SelectItem>
                        <SelectItem value="SJF" className="hover:bg-purple-50 dark:hover:bg-slate-700">Shortest Job First (Non-P)</SelectItem>
                        <SelectItem value="SRTF" className="hover:bg-purple-50 dark:hover:bg-slate-700">Shortest Remaining Time First (SRTF)</SelectItem>
                        <SelectItem value="Priority" className="hover:bg-purple-50 dark:hover:bg-slate-700">Priority Scheduling</SelectItem>
                        <SelectItem value="RR" className="hover:bg-purple-50 dark:hover:bg-slate-700">Round Robin (RR)</SelectItem>
                        <SelectItem value="MLQ" className="hover:bg-purple-50 dark:hover:bg-slate-700">Multi-Level Queue (macOS)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {algorithm === 'RR' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider">Time Quantum — max time per turn before switching</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min={1}
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                            className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/50 h-10 font-mono shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                        />
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">ms</span>
                    </div>
                </div>
            )}

            {algorithm === 'MLQ' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                        <p className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">macOS-style Queue Tiers</p>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                            <span><strong>Q1 — System</strong> (highest priority) • Round Robin</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                            <span><strong>Q2 — Interactive</strong> (medium) • Round Robin</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span><strong>Q3 — Batch</strong> (lowest) • FCFS</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">Higher queues always preempt lower queues. Assign each process a queue level.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Q1 Quantum</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    value={mlqConfig.q1TimeQuantum}
                                    onChange={(e) => setMLQConfig({ q1TimeQuantum: parseInt(e.target.value) || 1 })}
                                    className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 font-mono shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                                />
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">ms</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Q2 Quantum</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    value={mlqConfig.q2TimeQuantum}
                                    onChange={(e) => setMLQConfig({ q2TimeQuantum: parseInt(e.target.value) || 1 })}
                                    className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 font-mono shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                                />
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 pt-2">
                <Label className="text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold tracking-wider">Playback — animate or step through the timeline</Label>

                <div className="flex gap-2">
                    <Button
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all font-semibold h-10 active:scale-[0.98]"
                        onClick={togglePlayback}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "PAUSE" : "START"}
                    </Button>

                    <Button
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 w-10 h-10 p-0 shadow-sm hover:shadow transition-all"
                        onClick={step}
                        title="Step Forward (advance by 1 unit)"
                    >
                        <StepForward className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300 dark:hover:border-red-800 text-slate-700 dark:text-slate-200 w-10 h-10 p-0 shadow-sm hover:shadow transition-all"
                        onClick={() => {
                            setCurrentTime(0);
                            if (isPlaying) togglePlayback();
                        }}
                        title="Reset to start of timeline"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 w-12">Speed</span>
                    <Slider
                        value={[simulationSpeed]}
                        min={0.5}
                        max={5}
                        step={0.5}
                        onValueChange={([v]) => setSimulationSpeed(v)}
                        className="flex-1"
                    />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 w-8 text-right font-semibold">{simulationSpeed}x</span>
                </div>
            </div>
        </div>
    );
};
