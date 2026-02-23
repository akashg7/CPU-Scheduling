"use client";

import { ProcessInput } from "@/components/visualizer/ProcessInput";
import { Controls } from "@/components/visualizer/Controls";
import { GanttChart } from "@/components/visualizer/GanttChart";
import { MetricsTable } from "@/components/visualizer/MetricsTable";
import { ReadyQueue } from "@/components/visualizer/ReadyQueue";
import { AskSchedbotBanner } from "@/components/schedbot/AskSchedbotBanner";
import { ComparisonView } from "@/components/visualizer/ComparisonView";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Cpu, BarChart3, Github, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { AlgorithmType } from "@/lib/types";

const ALGORITHM_TABS: { value: AlgorithmType; label: string }[] = [
  { value: "FCFS", label: "FCFS" },
  { value: "RR", label: "Round Robin" },
  { value: "SJF", label: "SJF" },
  { value: "SRTF", label: "SRTF" },
  { value: "Priority", label: "Priority" },
  { value: "MLQ", label: "MLQ" },
  { value: "MLFQ", label: "MLFQ" },
];

export default function VisualizerPage() {
  const { run, algorithm, processes, currentTime, totalDuration } = useStore();

  useEffect(() => {
    run();
  }, [run, algorithm, processes]);

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0F] text-slate-100 overflow-hidden">
      <Tabs defaultValue="simulator" className="flex-1 flex flex-col min-h-0">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-violet-500/20 bg-schedos-surface">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <Cpu className="w-5 h-5 text-violet-400" />
            <span className="font-display font-semibold">Team 404</span>
          </Link>

          <TabsList className="bg-schedos-elevated border border-slate-700 p-1 rounded-lg">
            <TabsTrigger
              value="simulator"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 rounded-md px-4 py-2 text-sm"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Simulator
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 rounded-md px-4 py-2 text-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Comparison
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              t = {currentTime.toFixed(1)} / {totalDuration || "—"}
            </span>
            <a
              href="https://github.com/akashg7/CPU-Scheduling"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] min-h-0">
          {/* Left: Config panel */}
          <aside className="flex-shrink-0 w-full lg:w-[320px] border-r border-slate-800 bg-schedos-surface overflow-y-auto">
            <div className="p-4 space-y-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Algorithm
                </h2>
                <AlgorithmTabs />
              </div>
              <Controls />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Processes
                </h2>
                <ProcessInput />
              </div>
            </div>
          </aside>

          {/* Center: CPU + Queue + Gantt + Playback */}
          <main className="flex flex-col min-w-0 min-h-0 bg-[#0A0A0F]">
            <TabsContent value="simulator" className="flex-1 flex flex-col min-h-0 m-0 data-[state=inactive]:hidden">
              {/* CPU + Ready Queue */}
              <section className="flex-shrink-0 p-6 bg-schedos-elevated/80 border-b border-slate-800">
                <ReadyQueue />
              </section>

              {/* Gantt */}
              <section className="flex-1 min-h-0 p-4 flex flex-col border-b border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Timeline
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    t = {currentTime.toFixed(1)}
                  </span>
                </div>
                <div className="flex-1 min-h-[120px]">
                  <GanttChart />
                </div>
              </section>

              {/* Playback bar */}
              <section className="flex-shrink-0 px-4 pt-8 pb-4 border-t border-slate-800 bg-schedos-surface">
                <PlaybackBar />
              </section>

              <div className="p-4">
                <AskSchedbotBanner />
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="flex-1 overflow-auto m-0 p-6 data-[state=inactive]:hidden">
              <ComparisonView />
            </TabsContent>
          </main>

        {/* Right: Metrics */}
        <aside className="flex-shrink-0 w-full lg:w-[300px] border-l border-slate-800 bg-schedos-surface overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <span>Metrics Σ</span>
            </h2>
            <MetricsTable />
          </div>
        </aside>
        </div>
      </Tabs>
    </div>
  );
}

function AlgorithmTabs() {
  const { algorithm, setAlgorithm, loadExample } = useStore();
  return (
    <div className="flex flex-wrap gap-2">
      {ALGORITHM_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setAlgorithm(tab.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            algorithm === tab.value
              ? "bg-violet-600 text-white border border-violet-500"
              : "bg-schedos-elevated border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
      <div className="w-full mt-2">
        <button
          onClick={() => loadExample(algorithm)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-violet-500/40 text-violet-400 text-xs font-medium hover:bg-violet-500/10 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          Load Example
        </button>
      </div>
    </div>
  );
}

function PlaybackBar() {
  const {
    isPlaying,
    togglePlayback,
    setCurrentTime,
    step,
    stepBack,
    totalDuration,
    currentTime,
    simulationSpeed,
    setSimulationSpeed,
  } = useStore();

  const progressPct = totalDuration ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => {
            setCurrentTime(0);
            if (isPlaying) togglePlayback();
          }}
          className="p-2 rounded-lg bg-schedos-elevated border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          title="Reset"
        >
          ⏮
        </button>
        <button
          onClick={stepBack}
          className="p-2 rounded-lg bg-schedos-elevated border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          title="Step back"
        >
          ⏪
        </button>
        <button
          onClick={togglePlayback}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={step}
          className="p-2 rounded-lg bg-schedos-elevated border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          title="Step forward"
        >
          ⏩
        </button>
        <button
          onClick={() => {
            setCurrentTime(totalDuration);
            if (isPlaying) togglePlayback();
          }}
          className="p-2 rounded-lg bg-schedos-elevated border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          title="End"
        >
          ⏭
        </button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-slate-500">Speed</span>
          <select
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
            className="bg-schedos-elevated border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {[0.5, 1, 2, 4].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-1 w-full bg-schedos-elevated rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-violet-600 rounded-full"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "tween", duration: 0.2 }}
        />
      </div>
    </div>
  );
}
