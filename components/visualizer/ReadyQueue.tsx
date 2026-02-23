"use client";

import { useStore } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { SimulatorCPU } from "@/components/cpu/SimulatorCPU";

export const ReadyQueue = () => {
    const { results, currentTime, processes, algorithm } = useStore();

    const snapshots = results?.snapshots || [];
    const currentSnapshot = snapshots.filter(s => s.time <= currentTime).pop();
    const displaySnapshot = currentSnapshot || (snapshots.length > 0 ? snapshots[0] : null);

    const queueIds = displaySnapshot?.readyQueue || [];
    const runningId = displaySnapshot?.runningProcessId;

    const getProcess = (id: string) => processes.find(p => p.id === id);

    const contextSwitches = results?.logs?.filter(l => l.type === 'warning').length ?? 0;

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-start">
            <SimulatorCPU
                processId={runningId ?? "P1"}
                isIdle={!runningId}
            />

            {/* Dispatch → */}
            <div className="hidden md:flex flex-col items-center gap-1.5">
                <div className="w-16 h-px bg-gradient-to-r from-slate-600 to-transparent" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Dispatch →</span>
                <div className="w-16 h-px bg-gradient-to-r from-slate-600 to-transparent" />
            </div>

            {/* Ready Queue */}
            <div className="flex-1 min-w-0 w-full md:min-w-[200px] p-5 rounded-xl bg-schedos-surface border border-slate-800 min-h-[140px] flex flex-col justify-center max-w-full overflow-hidden">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Ready Queue · {queueIds.length} process{queueIds.length !== 1 ? 'es' : ''} waiting
                    </span>
                </div>
                <div className="flex flex-wrap gap-3 overflow-x-auto overflow-y-visible pb-2 items-center min-h-[56px] content-start">
                    <AnimatePresence mode="popLayout">
                        {queueIds.map((id) => {
                            const p = getProcess(id);
                            return (
                                <motion.div
                                    key={id}
                                    layout
                                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, x: -20 }}
                                    className="relative flex-shrink-0"
                                    title={p ? `Arr: ${p.arrivalTime} | Bur: ${p.burstTime} | Pri: ${p.priority}` : undefined}
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm text-white border-2 transition-transform hover:scale-105"
                                        style={{ backgroundColor: `${p?.color}30`, borderColor: p?.color }}
                                    >
                                        {id}
                                    </div>
                                    {(algorithm === 'Priority' || algorithm === 'SJF' || algorithm === 'SRTF' || algorithm === 'SRJF') && (
                                        <div className="absolute -bottom-1 -right-1 bg-schedos-elevated text-[10px] text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                                            {algorithm === 'Priority' ? `P${p?.priority}` : `${p?.burstTime}`}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {queueIds.length === 0 && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="italic">Queue is empty</span>
                        </div>
                    )}
                </div>
                {contextSwitches > 0 && (
                    <span className="inline-flex items-center mt-2 text-[10px] text-amber-400 font-mono">
                        Context Switches: {contextSwitches}
                    </span>
                )}
            </div>
        </div>
    );
};
