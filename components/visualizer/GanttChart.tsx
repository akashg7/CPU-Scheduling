"use client";

import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const GanttChart = () => {
    const { results, totalDuration, currentTime, setCurrentTime, isPlaying } = useStore();

    // Animation loop
    useEffect(() => {
        let animationFrameId: number;
        let lastTime: number;

        const loop = (time: number) => {
            if (!lastTime) lastTime = time;
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            if (useStore.getState().isPlaying) {
                const current = useStore.getState().currentTime;
                const max = useStore.getState().totalDuration;

                let next = current + delta * useStore.getState().simulationSpeed;
                if (next >= max) {
                    next = max;
                    useStore.getState().togglePlayback();
                }
                setCurrentTime(next);

                if (next < max) {
                    animationFrameId = requestAnimationFrame(loop);
                }
            }
        };

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(loop);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, setCurrentTime]);

    const duration = Math.max(totalDuration, 10);

    return (
        <div className="relative w-full h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden group shadow-inner">
            {/* Grid Background */}
            <div className="absolute inset-0 flex">
                {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                    <div key={i} className="flex-1 border-r border-slate-200/50 h-full" />
                ))}
            </div>

            {/* Blocks */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center p-4">
                {results?.ganttChart.map((block, i) => {
                    const startPercent = (block.startTime / duration) * 100;
                    const widthPercent = ((block.endTime - block.startTime) / duration) * 100;

                    let visibleWidth = 0;
                    if (currentTime >= block.endTime) visibleWidth = 100;
                    else if (currentTime > block.startTime) {
                        const executed = currentTime - block.startTime;
                        visibleWidth = (executed / (block.endTime - block.startTime)) * 100;
                    }

                    if (currentTime <= block.startTime) return null;

                    return (
                        <div
                            key={i}
                            className="absolute h-14 rounded-lg bg-white/80 overflow-hidden shadow-md border border-slate-200/60"
                            style={{
                                left: `${startPercent}%`,
                                width: `${widthPercent}%`,
                            }}
                        >
                            {/* Filled part */}
                            <div
                                className="absolute inset-y-0 left-0 transition-all duration-200"
                                style={{
                                    width: `${visibleWidth}%`,
                                    backgroundColor: block.color,
                                    opacity: 0.85,
                                }}
                            />

                            {/* Label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white drop-shadow-lg tracking-wide">
                                    {widthPercent > 3 ? block.processId : ''}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Timeline Cursor */}
            <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-blue-600 z-20 shadow-lg"
                style={{
                    left: `${(currentTime / duration) * 100}%`,
                    filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))'
                }}
            />

            {/* Time Markers */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-3 pointer-events-none">
                <span className="text-xs text-slate-500 font-mono font-semibold">0</span>
                <span className="text-xs text-slate-500 font-mono font-semibold">{duration}</span>
            </div>
        </div>
    );
};
