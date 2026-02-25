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

    const handleTouchScrub = useCallback(
        (e: React.TouchEvent<HTMLDivElement>) => {
            const el = containerRef.current;
            if (!el || !e.changedTouches?.length) return;
            const touch = e.changedTouches[0];
            const rect = el.getBoundingClientRect();
            const x = touch.clientX - rect.left;
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
                onTouchEnd={handleTouchScrub}
                onKeyDown={(e) => {
                    const step = e.shiftKey ? 2 : 0.5;
                    if (e.key === "ArrowLeft") setCurrentTime(Math.max(0, currentTime - step));
                    if (e.key === "ArrowRight") setCurrentTime(Math.min(duration, currentTime + step));
                }}
                className="relative w-full h-28 bg-schedos-elevated rounded-xl border border-slate-800 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-schedos-base"
            >
                {/* Grid Background */}
                <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-800/80 h-full" />
                    ))}
                </div>

                {/* Blocks — Framer Motion width animation */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center p-3 pointer-events-none">
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
                            <motion.div
                                key={i}
                                className="absolute h-12 rounded-md overflow-hidden"
                                style={{
                                    left: `${startPercent}%`,
                                    width: `${widthPercent}%`,
                                    backgroundColor: `${block.color}30`,
                                    border: `1px solid ${block.color}60`,
                                }}
                                initial={false}
                                animate={{ opacity: 1 }}
                            >
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-l-md"
                                    style={{
                                        backgroundColor: block.color,
                                    }}
                                    initial={false}
                                    animate={{ width: `${visibleWidth}%` }}
                                    transition={{ type: "tween", duration: 0.2 }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-bold text-white drop-shadow-md font-mono">
                                        {widthPercent > 4 ? block.processId : ""}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Scrub cursor */}
                <motion.div
                    className="absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none"
                    style={{
                        left: `${(currentTime / duration) * 100}%`,
                        background: 'linear-gradient(to bottom, #7C3AED, #06B6D4)',
                        boxShadow: '0 0 10px rgba(124, 58, 237, 0.6)',
                    }}
                />
                <div
                    className="absolute top-0 z-30 pointer-events-none -translate-x-1/2 -translate-y-0.5"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                >
                    <div className="w-2 h-2 rotate-45 bg-white" />
                </div>

                {/* Time label at cursor */}
                <div
                    className="absolute bottom-1 z-30 pointer-events-none -translate-x-1/2"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                >
                    <span className="inline-block px-2 py-0.5 rounded bg-schedos-surface border border-violet-500/50 text-cyan-400 text-xs font-mono font-bold whitespace-nowrap">
                        t = {currentTime.toFixed(1)}
                    </span>
                </div>

                {/* Time tick marks */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 pointer-events-none">
                    {ticks.map((t) => (
                        <span key={t} className="text-[10px] text-slate-500 font-mono">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">Click or tap to scrub · Use ← → keys to step</p>
        </div>
    );
};
