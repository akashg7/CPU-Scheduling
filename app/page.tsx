"use client";

import { ProcessInput } from "@/components/visualizer/ProcessInput";
import { Controls } from "@/components/visualizer/Controls";
import { GanttChart } from "@/components/visualizer/GanttChart";
import { MetricsTable } from "@/components/visualizer/MetricsTable";
import { ReadyQueue } from "@/components/visualizer/ReadyQueue";
import { InsightsPanel } from "@/components/visualizer/InsightsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComparisonView } from "@/components/visualizer/ComparisonView";
import { Cpu, BarChart3, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const ALGO_LABELS: Record<string, string> = {
  FCFS: "First Come First Serve",
  SJF: "Shortest Job First",
  SRTF: "Shortest Remaining Time First",
  Priority: "Priority",
  RR: "Round Robin",
  MLQ: "Multi-Level Queue (static)",
  MLFQ: "Multi-Level Feedback Queue (macOS)",
};

export default function Home() {
  const { run, algorithm, processes, timeQuantum, mlqConfig, results, currentTime, totalDuration } = useStore();

  // Auto-run simulation when inputs change
  useEffect(() => {
    run();
  }, [run, algorithm, processes, timeQuantum, mlqConfig]);

  return (
    <main className="min-h-screen p-4 md:p-8 font-sans bg-transparent relative">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 pt-2 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex-1 pr-14 md:pr-0">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 gradient-text">
              CPU Scheduling Visualizer
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4 leading-relaxed max-w-2xl">
              Add processes (arrival, burst, priority), pick an algorithm, then watch the timeline. Use the Comparison tab to see which algorithm gives the best waiting and turnaround times.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700 font-semibold px-3 py-1">
                {ALGO_LABELS[algorithm] ?? algorithm}
              </Badge>
              {results && (
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-mono">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>t = {currentTime.toFixed(1)}</span>
                  <span className="text-slate-400 dark:text-slate-500">/</span>
                  <span>{totalDuration}</span>
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Controls & Inputs */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="glass-card shadow-lg border-slate-200/50 dark:border-slate-700/50 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Controls />
                <ProcessInput />
              </CardContent>
            </Card>
          </div>

          {/* Right Area: Visualization & Metrics */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="visualizer" className="w-full">
              <TabsList className="glass w-full p-1.5 mb-4 dark:bg-slate-800/80">
                <TabsTrigger
                  value="visualizer"
                  className="flex-1 font-medium tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-all duration-200"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  Visualizer
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="flex-1 font-medium tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white transition-all duration-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Comparison
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualizer" className="space-y-6 animate-fade-in">
                <Card className="glass-card shadow-lg border-slate-200/50 dark:border-slate-700/50 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 dark:text-slate-100">Visualization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ready Queue & CPU — processes waiting to run, and the one currently running</h3>
                      <ReadyQueue />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Timeline — click to scrub, use play or step to animate</h3>
                      <GanttChart />
                      {processes.length > 0 && (
                        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Processes</span>
                          {processes.map((p) => (
                            <span key={p.id} className="inline-flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                              <span className="w-3 h-3 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/20" style={{ backgroundColor: p.color }} />
                              <span className="font-medium">{p.id}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <InsightsPanel />

                <Card className="glass-card shadow-lg border-slate-200/50 dark:border-slate-700/50 card-hover transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 dark:text-slate-100">Metrics — waiting time, turnaround time, CPU utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="animate-fade-in">
                <ComparisonView />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
