"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { generateAIProcesses } from "@/lib/ai-generator";
import { useStore } from "@/store/useStore";

export const AiProcessGenerator = () => {
    const [scenario, setScenario] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setProcesses, setAlgorithm } = useStore();

    const handleGenerate = async () => {
        if (scenario.trim().length < 10) {
            setError("Please conceptually describe a scenario with at least 10 characters.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await generateAIProcesses(scenario);
            setProcesses(result.processes);
            if (result.algorithm) {
                setAlgorithm(result.algorithm);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-5 mb-6 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-xl"></div>

            <div className="flex items-center justify-between mb-4 pl-2">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-wide text-sm">AI Process Generator</h3>
                </div>
            </div>

            <div className="space-y-3 pl-2">
                <Textarea
                    placeholder="Example: Show starvation in priority scheduling..."
                    value={scenario}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScenario(e.target.value)}
                    className="min-h-[80px] bg-white/80 dark:bg-slate-900/50 border-indigo-100 dark:border-indigo-800 focus-visible:ring-indigo-500 resize-none font-medium text-sm placeholder:text-slate-400"
                    disabled={isLoading}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Describe a scheduling concept and AI will generate suitable processes.
                    </p>

                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading || scenario.trim().length === 0}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all sm:w-auto w-full font-semibold px-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate
                            </>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-3 p-2.5 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-100 dark:border-red-900/50">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
