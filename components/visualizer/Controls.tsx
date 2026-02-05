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
        <div className="grid grid-cols-1 gap-5">
            <div className="space-y-3">
                <Label className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-widest">Algorithm</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)}>
                    <SelectTrigger className="bg-black border-[#232838] text-[#E5E7EB] focus:ring-1 focus:ring-blue-500/50 h-9 text-xs">
                        <SelectValue placeholder="Select Algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#232838] text-[#E5E7EB] shadow-xl rounded-lg">
                        <SelectItem value="FCFS">First Come First Serve</SelectItem>
                        <SelectItem value="SJF">Shortest Job First (Non-P)</SelectItem>
                        {/* <SelectItem value="SRJF">Shortest Remaining Job First</SelectItem> */}
                        {/* <SelectItem value="Priority">Priority Scheduling</SelectItem> */}
                        <SelectItem value="RR">Round Robin (RR)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {algorithm === 'RR' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-widest">Time Quantum</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            min={1}
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                            className="bg-black border-[#232838] text-[#E5E7EB] focus-visible:ring-1 focus-visible:ring-blue-500/50 h-9 font-mono text-xs"
                        />
                        <span className="text-xs text-[#6B7280]">ms</span>
                    </div>
                </div>
            )}

            <div className="space-y-3 pt-2">
                <Label className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-widest">Playback</Label>

                <div className="flex gap-2">
                    <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10 transition-all font-medium h-9 text-xs active:scale-[0.98] border border-transparent"
                        onClick={togglePlayback}
                    >
                        {isPlaying ? <Pause className="w-3 h-3 mr-2" /> : <Play className="w-3 h-3 mr-2" />}
                        {isPlaying ? "PAUSE" : "START"}
                    </Button>

                    <Button
                        variant="outline"
                        className="border-[#232838] bg-[#0F1115] hover:bg-[#1C2029] text-[#9CA3AF] hover:text-[#E5E7EB] w-9 h-9 p-0"
                        onClick={step}
                        title="Step Forward"
                    >
                        <StepForward className="w-3 h-3" />
                    </Button>

                    <Button
                        variant="outline"
                        className="border-[#232838] bg-[#0F1115] hover:bg-red-900/10 hover:text-red-400 hover:border-red-900/30 text-[#9CA3AF] w-9 h-9 p-0"
                        onClick={() => {
                            setCurrentTime(0);
                            if (isPlaying) togglePlayback();
                        }}
                        title="Reset"
                    >
                        <RotateCcw className="w-3 h-3" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <span className="text-[9px] uppercase font-bold text-[#6B7280] w-8">Speed</span>
                    <Slider
                        value={[simulationSpeed]}
                        min={0.5}
                        max={5}
                        step={0.5}
                        onValueChange={([v]) => setSimulationSpeed(v)}
                        className="flex-1"
                    />
                    <span className="text-[9px] font-mono text-[#6B7280] w-6 text-right">{simulationSpeed}x</span>
                </div>
            </div>
        </div>
    );
};
