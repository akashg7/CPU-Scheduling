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
        isPlaying, togglePlayback,
        setCurrentTime, step,
        simulationSpeed, setSimulationSpeed
    } = useStore();

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
                <Label className="text-slate-600 text-xs uppercase font-semibold tracking-wider">Algorithm</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)}>
                    <SelectTrigger className="bg-white/80 border-slate-300 text-slate-800 focus:ring-2 focus:ring-purple-500/50 h-10 shadow-sm hover:border-purple-400 transition-colors">
                        <SelectValue placeholder="Select Algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-2xl rounded-xl">
                        <SelectItem value="FCFS" className="hover:bg-purple-50">First Come First Serve</SelectItem>
                        <SelectItem value="SJF" className="hover:bg-purple-50">Shortest Job First (Non-P)</SelectItem>
                        <SelectItem value="Priority" className="hover:bg-purple-50">Priority Scheduling</SelectItem>
                        <SelectItem value="RR" className="hover:bg-purple-50">Round Robin (RR)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {algorithm === 'RR' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-slate-600 text-xs uppercase font-semibold tracking-wider">Time Quantum</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min={1}
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                            className="bg-white/80 border-slate-300 text-slate-800 focus-visible:ring-2 focus-visible:ring-purple-500/50 h-10 font-mono shadow-sm hover:border-purple-400 transition-colors"
                        />
                        <span className="text-sm text-slate-500 font-medium">ms</span>
                    </div>
                </div>
            )}

            <div className="space-y-4 pt-2">
                <Label className="text-slate-600 text-xs uppercase font-semibold tracking-wider">Playback</Label>

                <div className="flex gap-2">
                    <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold h-10 active:scale-[0.98]"
                        onClick={togglePlayback}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "PAUSE" : "START"}
                    </Button>

                    <Button
                        variant="outline"
                        className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 w-10 h-10 p-0 shadow-sm hover:shadow transition-all"
                        onClick={step}
                        title="Step Forward"
                    >
                        <StepForward className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="border-slate-300 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 text-slate-700 w-10 h-10 p-0 shadow-sm hover:shadow transition-all"
                        onClick={() => {
                            setCurrentTime(0);
                            if (isPlaying) togglePlayback();
                        }}
                        title="Reset"
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
                    <span className="text-xs font-mono text-slate-600 w-8 text-right font-semibold">{simulationSpeed}x</span>
                </div>
            </div>
        </div>
    );
};
