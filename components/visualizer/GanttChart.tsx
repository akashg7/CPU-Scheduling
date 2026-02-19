"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

export const GanttChart = () => {
    const { results, totalDuration, currentTime, setCurrentTime, isPlaying } = useStore();
    const containerRef = useRef<HTMLDivElement>(null);

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

    const handleScrub = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, x / rect.width));
            const t = pct * duration;
            setCurrentTime(t);
        },
        [duration, setCurrentTime]
    );

    const tickStep = duration <= 10 ? 2 : duration <= 30 ? 5 : Math.ceil(duration / 6);
    const ticks = Array.from({ length: Math.ceil(duration / tickStep) + 1 }, (_, i) => i * tickStep).filter((t) => t <= duration);

    return (
        <div className="space-y-2">
            <div
                ref={containerRef}
                role="slider"
                aria-label="Timeline"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                tabIndex={0}
                onClick={handleScrub}
                onKeyDown={(e) => {
                    const step = e.shiftKey ? 2 : 0.5;
                    if (e.key === "ArrowLeft") setCurrentTime(Math.max(0, currentTime - step));
                    if (e.key === "ArrowRight") setCurrentTime(Math.min(duration, currentTime + step));
                }}
                className="relative w-full h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden group shadow-inner cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
                {/* Grid Background */}
                <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-200/50 h-full" />
                    ))}
                </div>

                {/* Blocks */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center p-4 pointer-events-none">
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
                                <div
                                    className="absolute inset-y-0 left-0 transition-all duration-200"
                                    style={{
                                        width: `${visibleWidth}%`,
                                        backgroundColor: block.color,
                                        opacity: 0.85,
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white drop-shadow-lg tracking-wide">
                                        {widthPercent > 3 ? block.processId : ""}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Timeline Cursor */}
                <motion.div
                    className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-600 z-20 shadow-lg pointer-events-none"
                    style={{
                        left: `${(currentTime / duration) * 100}%`,
                        filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))",
                    }}
                />

                {/* Time label at cursor */}
                <div
                    className="absolute bottom-2 z-30 pointer-events-none transition-all duration-75 -translate-x-1/2"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                >
                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-600 text-white text-xs font-mono font-bold shadow-md whitespace-nowrap">
                        t = {currentTime.toFixed(1)}
                    </span>
                </div>

                {/* Time tick marks */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-3 pointer-events-none">
                    {ticks.map((t) => (
                        <span key={t} className="text-xs text-slate-500 font-mono font-semibold">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
            <p className="text-xs text-slate-500 pl-1">Click or drag on timeline to scrub · Arrow keys to step</p>
        </div>
    );
};
