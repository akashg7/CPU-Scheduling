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
            {/* HER HERO CPU */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative flex flex-col items-center justify-center w-32 h-32 bg-black rounded-2xl border border-[#232838] shadow-2xl overflow-hidden">

                    <span className="absolute top-2 text-[10px] text-[#6B7280] uppercase tracking-widest font-bold">ACTIVE CPU</span>

                    <AnimatePresence mode="wait">
                        {runningId ? (
                            <motion.div
                                key={runningId}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-3xl text-white shadow-lg z-10"
                                style={{ backgroundColor: getProcess(runningId)?.color || '#333' }}
                            >
                                {runningId}
                            </motion.div>
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-[#161A22] border-2 border-dashed border-[#232838] flex items-center justify-center text-[#4B5563] text-xs font-medium">
                                IDLE
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Activity Bar */}
                    {runningId && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                            animate={{ opacity: [0.4, 1, 0.4] }}
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
                                fill="none" stroke="#1F2937" strokeWidth="2"
                            />
                            <rect
                                x="1" y="1" width="98" height="98" rx="15"
                                fill="none" stroke="#3B82F6" strokeWidth="2"
                                strokeDasharray="400"
                                strokeDashoffset={400 - (progress / 100) * 400}
                                className="transition-all duration-100 ease-linear"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Connection Line */}
            <div className="hidden md:flex flex-col items-center gap-1">
                <div className="w-16 h-[1px] bg-gradient-to-r from-[#232838] to-transparent"></div>
                <div className="text-[10px] text-[#4B5563] uppercase tracking-wider font-medium">Dispatch</div>
                <div className="w-16 h-[1px] bg-gradient-to-r from-[#232838] to-transparent"></div>
            </div>

            {/* Ready Queue */}
            <div className="flex-1 w-full md:w-auto p-5 bg-black rounded-xl border border-[#232838] min-h-[128px] flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#232838]"></div>

                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest font-bold flex items-center gap-2">
                        Ready Queue <span className="w-1 h-1 rounded-full bg-[#3B82F6]"></span>
                    </span>
                    <span className="text-[10px] text-[#4B5563] font-mono tabular-nums">{queueIds.length} Process{queueIds.length !== 1 ? 'es' : ''}</span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 items-center min-h-[48px]">
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
                                        className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm border border-white/5 ring-1 ring-white/10 z-10 relative"
                                        style={{ backgroundColor: p?.color }}
                                    >
                                        {id}
                                    </div>
                                    {/* Badges */}
                                    {(algorithm === 'Priority' || algorithm === 'SJF' || algorithm === 'SRJF') && (
                                        <div className="absolute -bottom-2 -right-1 bg-[#161A22] text-[9px] text-[#9CA3AF] px-1.5 py-0.5 rounded border border-[#232838] shadow-sm z-20 font-mono">
                                            {algorithm === 'Priority' ? `P${p?.priority}` : `${p?.burstTime}ms`}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {queueIds.length === 0 && (
                        <div className="flex items-center gap-2 text-[#4B5563] text-xs">
                            <span className="italic">Queue is empty</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
