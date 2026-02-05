"use client";

import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const GanttChart = () => {
    const { results, totalDuration, currentTime, setCurrentTime, isPlaying } = useStore();

    // Animation loop (Kept same logic, just styled)
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
        <div className="relative w-full h-24 bg-black rounded-xl border border-[#232838] overflow-hidden group">
            {/* Grid Background */}
            <div className="absolute inset-0 flex">
                {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                    <div key={i} className="flex-1 border-r border-[#232838]/50 h-full" />
                ))}
            </div>

            {/* Blocks */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center p-3">
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
                            className="absolute h-12 rounded bg-[#161A22] overflow-hidden shadow-sm"
                            style={{
                                left: `${startPercent}%`,
                                width: `${widthPercent}%`,
                            }}
                        >
                            {/* Filled part */}
                            <div
                                className="absolute inset-y-0 left-0"
                                style={{
                                    width: `${visibleWidth}%`,
                                    backgroundColor: block.color,
                                    opacity: 0.9,
                                }}
                            />

                            {/* Label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white drop-shadow-md tracking-wider">
                                    {widthPercent > 2 ? block.processId : ''}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Timeline Cursor */}
            <motion.div
                className="absolute top-0 bottom-0 w-[1px] bg-blue-500/80 z-20 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{
                    left: `${(currentTime / duration) * 100}%`
                }}
            />

            {/* Time Markers */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 pointer-events-none">
                <span className="text-[9px] text-[#4B5563] font-mono">0</span>
                <span className="text-[9px] text-[#4B5563] font-mono">{duration}</span>
            </div>
        </div>
    );
};
