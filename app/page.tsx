"use client";

import { ProcessInput } from "@/components/visualizer/ProcessInput";
import { Controls } from "@/components/visualizer/Controls";
import { GanttChart } from "@/components/visualizer/GanttChart";
import { MetricsTable } from "@/components/visualizer/MetricsTable";
import { ReadyQueue } from "@/components/visualizer/ReadyQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComparisonView } from "@/components/visualizer/ComparisonView";

export default function Home() {
  const { run, algorithm, processes, timeQuantum } = useStore();

  // Auto-run simulation when inputs change
  useEffect(() => {
    run();
  }, [run, algorithm, processes, timeQuantum]);

  return (
    <main className="min-h-screen bg-black text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#E5E7EB] tracking-tight">
              CPU Scheduling Visualizer
            </h1>
            <p className="text-[#E5E7EB] mt-1">
              Visualize and compare scheduling algorithms with deterministic precision.
            </p>
          </div>
          {/* <div className="flex gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Next.js 14</Badge>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">TypeScript</Badge>
          </div> */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Controls & Inputs */}
          <div className="space-y-6 lg:col-span-1 lg:mt-16">
            <Card className="bg-black border-[#232838] shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#E5E7EB]">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Controls />
                <ProcessInput />
              </CardContent>
            </Card>
          </div>

          {/* Right Area: Visualization & Metrics */}
          <div className="space-y-6 lg:col-span-2 mt-1">
            <Tabs defaultValue="visualizer" className="w-full">
              <TabsList className="bg-[#161A22] border-[#232838] mb-4 p-1">
                <TabsTrigger value="visualizer" className="font-medium text-[#E5E7EB] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-[#E5E7EB] data-[state=active]:shadow-sm text-[#E5E7EB]">Visualizer</TabsTrigger>
                <TabsTrigger value="comparison" className="font-medium text-[#E5E7EB] uppercase tracking-widest data-[state=active]:bg-black data-[state=active]:text-[#E5E7EB] data-[state=active]:shadow-sm text-[#E5E7EB]">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="visualizer" className="space-y-6">
                <Card className="bg-black border-[#232838] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#E5E7EB]">Visualization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-[#E5E7EB] uppercase tracking-wider">Ready Queue & CPU</h3>
                      <ReadyQueue />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-[#E5E7EB] uppercase tracking-wider">Timeline</h3>
                      <GanttChart />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border-[#232838] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#E5E7EB]">Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison">
                <ComparisonView />
              </TabsContent>  
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
