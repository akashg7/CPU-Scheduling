"use client";

import { useStore } from "@/store/useStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Terminal, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export const ObservabilityPanel = () => {
    const { results, currentTime } = useStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    const visibleLogs = results?.logs.filter(l => l.time <= currentTime).sort((a, b) => a.time - b.time) || [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [visibleLogs.length]);

    if (!results) return null;

    return (
        <div className="flex flex-col h-full bg-[#161A22] border border-[#232838] rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#232838] bg-[#161A22]">
                <Terminal className="w-3 h-3 text-[#9CA3AF]" />
                <h3 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">System Logs</h3>
                <span className="ml-auto text-[10px] font-mono text-[#6B7280]">
                    T={currentTime.toFixed(1)}s
                </span>
            </div>

            <ScrollArea className="flex-1 p-4 h-[300px] bg-[#0F1115]">
                <div className="space-y-4">
                    {visibleLogs.length === 0 && (
                        <div className="text-[#4B5563] text-xs italic text-center mt-12 flex flex-col items-center gap-2">
                            <Activity className="w-4 h-4 opacity-50" />
                            <span>Ready for simulation...</span>
                        </div>
                    )}

                    {visibleLogs.map((log, i) => (
                        <div key={i} className="flex gap-3 text-sm animate-in fade-in slide-in-from-left-2 duration-300 group">
                            <div className="flex-shrink-0 mt-0.5">
                                {log.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" />}
                                {log.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-500/80" />}
                                {log.type === 'info' && <Activity className="w-3.5 h-3.5 text-blue-500/80" />}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className={cn(
                                    "text-[#D1D5DB] text-xs leading-relaxed",
                                    log.type === 'success' && "text-emerald-200",
                                    log.type === 'warning' && "text-amber-200"
                                )}>
                                    {log.message}
                                </span>
                                <span className="text-[9px] text-[#4B5563] font-mono group-hover:text-[#6B7280] transition-colors">
                                    @{log.time.toFixed(1)}s
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
        </div>
    );
};
