"use client";

import { useStore } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";

export const ReadyQueue = () => {
    const { results, currentTime, processes, algorithm, timeQuantum } = useStore();

    // Derived state: snapshots
    const snapshots = results?.snapshots || [];
    const currentSnapshot = snapshots.filter(s => s.time <= currentTime).pop();
    const displaySnapshot = currentSnapshot || (snapshots.length > 0 ? snapshots[0] : null);

    const queueIds = displaySnapshot?.readyQueue || [];
    const runningId = displaySnapshot?.runningProcessId;

    const getProcess = (id: string) => processes.find(p => p.id === id);

    // Progress calculation for RR
    const currentBlock = results?.ganttChart.find(b => b.processId === runningId && currentTime >= b.startTime && currentTime <= b.endTime);
    let progress = 0;
    if (currentBlock && algorithm === 'RR') {
        const executed = currentTime - currentBlock.startTime;
        progress = Math.min((executed / timeQuantum) * 100, 100);
    }


    return (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-start">
            {/* HERO CPU */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl overflow-hidden">

                    <span className="absolute top-3 text-xs text-slate-500 uppercase tracking-widest font-bold">ACTIVE CPU</span>

                    <AnimatePresence mode="wait">
                        {runningId ? (
                            <motion.div
                                key={runningId}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-20 h-20 rounded-xl flex items-center justify-center font-bold text-3xl text-white shadow-lg z-10"
                                style={{ backgroundColor: getProcess(runningId)?.color || '#333' }}
                            >
                                {runningId}
                            </motion.div>
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm font-semibold">
                                IDLE
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Activity Bar */}
                    {runningId && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    )}
                </div>

                {/* RR Quantum Ring */}
                {algorithm === 'RR' && runningId && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <rect
                                x="1" y="1" width="98" height="98" rx="15"
                                fill="none" stroke="#e2e8f0" strokeWidth="2"
                            />
                            <rect
                                x="1" y="1" width="98" height="98" rx="15"
                                fill="none" stroke="url(#gradient)" strokeWidth="2"
                                strokeDasharray="400"
                                strokeDashoffset={400 - (progress / 100) * 400}
                                className="transition-all duration-100 ease-linear"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                )}
            </div>

            {/* Connection Line */}
            <div className="hidden md:flex flex-col items-center gap-1.5">
                <div className="w-20 h-[1px] bg-gradient-to-r from-slate-300 to-transparent"></div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Dispatch</div>
                <div className="w-20 h-[1px] bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* Ready Queue */}
            <div className="flex-1 w-full md:w-auto p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 min-h-[140px] flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-blue-400 rounded-l-2xl"></div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-slate-600 uppercase tracking-widest font-bold flex items-center gap-2">
                        Ready Queue <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">{queueIds.length} Process{queueIds.length !== 1 ? 'es' : ''}</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 items-center min-h-[56px]">
                    <AnimatePresence mode="popLayout">
                        {queueIds.map((id) => {
                            const p = getProcess(id);
                            return (
                                <motion.div
                                    key={id}
                                    layout
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="relative group flex-shrink-0"
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-md border border-white/20 ring-1 ring-black/5 z-10 relative hover:scale-105 transition-transform"
                                        style={{ backgroundColor: p?.color }}
                                    >
                                        {id}
                                    </div>
                                    {/* Badges */}
                                    {(algorithm === 'Priority' || algorithm === 'SJF' || algorithm === 'SRJF') && (
                                        <div className="absolute -bottom-2 -right-1 bg-white text-xs text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 shadow-sm z-20 font-mono font-semibold">
                                            {algorithm === 'Priority' ? `P${p?.priority}` : `${p?.burstTime}ms`}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {queueIds.length === 0 && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <span className="italic">Queue is empty</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
