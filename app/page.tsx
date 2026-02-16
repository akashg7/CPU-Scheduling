"use client";

import { ProcessInput } from "@/components/visualizer/ProcessInput";
import { Controls } from "@/components/visualizer/Controls";
import { GanttChart } from "@/components/visualizer/GanttChart";
import { MetricsTable } from "@/components/visualizer/MetricsTable";
import { ReadyQueue } from "@/components/visualizer/ReadyQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComparisonView } from "@/components/visualizer/ComparisonView";
import { Cpu, BarChart3 } from "lucide-react";

export default function Home() {
  const { run, algorithm, processes, timeQuantum } = useStore();

  // Auto-run simulation when inputs change
  useEffect(() => {
    run();
  }, [run, algorithm, processes, timeQuantum]);

  return (
    <main className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 gradient-text">
              CPU Scheduling Visualizer
            </h1>
            <p className="text-slate-600 text-lg">
              Visualize and compare scheduling algorithms with deterministic precision.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Controls & Inputs */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="glass-card shadow-xl border-slate-200/60 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
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
              <TabsList className="glass w-full p-1.5 mb-4">
                <TabsTrigger
                  value="visualizer"
                  className="flex-1 font-medium tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  Visualizer
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="flex-1 font-medium tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Comparison
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualizer" className="space-y-6 animate-fade-in">
                <Card className="glass-card shadow-xl border-slate-200/60 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800">Visualization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Ready Queue & CPU</h3>
                      <ReadyQueue />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Timeline</h3>
                      <GanttChart />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card shadow-xl border-slate-200/60 hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800">Metrics</CardTitle>
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
