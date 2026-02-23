"use client";

import { useStore } from "@/store/useStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, StepForward, Lightbulb } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ALGORITHM_EXAMPLES } from "@/lib/examples";

export const Controls = () => {
    const {
        algorithm,
        timeQuantum, setTimeQuantum,
        mlqConfig, setMLQConfig,
        isPlaying, togglePlayback,
        setCurrentTime, step,
        simulationSpeed, setSimulationSpeed,
        loadExample
    } = useStore();

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Algorithm is selected via the tabs above — no duplicate dropdown */}

            {/* Load Example Button */}
            <div className="space-y-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(algorithm)}
                    className="w-full gap-2 bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 border"
                >
                    <Lightbulb className="w-4 h-4" />
                    Load Example
                </Button>
                <div className="rounded-lg bg-schedos-elevated/80 border border-slate-700 px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-300">{ALGORITHM_EXAMPLES[algorithm].title}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{ALGORITHM_EXAMPLES[algorithm].description}</p>
                </div>
            </div>

            {algorithm === 'RR' && (
                <div className="space-y-3">
                    <Label className="text-slate-500 text-xs uppercase font-semibold tracking-wider">Time Quantum</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min={1}
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                            className="bg-schedos-elevated border-slate-700 text-slate-100 h-9 font-mono focus-visible:ring-2 focus-visible:ring-violet-500/50"
                        />
                        <span className="text-xs text-slate-500 font-medium">ms</span>
                    </div>
                </div>
            )}

            {(algorithm === 'MLQ' || algorithm === 'MLFQ') && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                        {algorithm === 'MLFQ' ? (
                            <>
                                <p className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">macOS-style MLFQ</p>
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
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                                    Feedback demotes CPU-hungry processes. Aging promotes starved ones.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">Static Multi-Level Queue</p>
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
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                                    Queues have fixed priority; Q1 is always served before Q2, and Q2 before Q3.
                                </p>
                            </>
                        )}
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
                    {algorithm === 'MLFQ' && (
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50 px-3 py-2.5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">⬇ Feedback (Demotion)</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Q1→Q2→Q3 on quantum expiry</p>
                                </div>
                                <Switch
                                    checked={mlqConfig.feedbackEnabled}
                                    onCheckedChange={(v) => setMLQConfig({ feedbackEnabled: v })}
                                />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50 px-3 py-2.5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">⬆ Aging (Promotion)</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Prevents starvation Q3→Q2→Q1</p>
                                </div>
                                <Switch
                                    checked={mlqConfig.agingEnabled}
                                    onCheckedChange={(v) => setMLQConfig({ agingEnabled: v })}
                                />
                            </div>
                            {mlqConfig.agingEnabled && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                                    <Label className="text-xs uppercase font-semibold text-slate-600 dark:text-slate-400 tracking-wider">Aging Threshold</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={mlqConfig.agingThreshold}
                                            onChange={(e) => setMLQConfig({ agingThreshold: parseInt(e.target.value) || 1 })}
                                            className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 h-10 font-mono shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                                        />
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">time units</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4 pt-2">
                <Label className="text-slate-500 text-xs uppercase font-semibold tracking-wider">Playback</Label>

                <div className="flex gap-2">
                    <Button
                        className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold h-9"
                        onClick={togglePlayback}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "Pause" : "Start"}
                    </Button>

                    <Button
                        variant="outline"
                        className="border-slate-700 bg-schedos-elevated hover:bg-slate-800 text-slate-300 w-9 h-9 p-0"
                        onClick={step}
                        title="Step Forward"
                    >
                        <StepForward className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="border-slate-700 bg-schedos-elevated hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 text-slate-300 w-9 h-9 p-0"
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
                    <span className="text-xs uppercase font-semibold text-slate-500 w-12">Speed</span>
                    <Slider
                        value={[simulationSpeed]}
                        min={0.5}
                        max={5}
                        step={0.5}
                        onValueChange={([v]) => setSimulationSpeed(v)}
                        className="flex-1"
                    />
                    <span className="text-xs font-mono text-slate-400 w-8 text-right">{simulationSpeed}x</span>
                </div>
            </div>
        </div>
    );
};
