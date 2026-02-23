"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroCPUVisualizer } from "@/components/cpu/HeroCPUVisualizer";
import {
  Cpu,
  Zap,
  Target,
  BarChart3,
  Bot,
  ChevronDown,
  Github,
} from "lucide-react";

const ALGOS = [
  { id: "FCFS", name: "FCFS", desc: "First Come First Serve", badge: "Non-preemptive", color: "cyan" },
  { id: "RR", name: "Round Robin", desc: "Time-sliced fairness", badge: "Preemptive", color: "violet" },
  { id: "SJF", name: "SJF", desc: "Shortest Job First", badge: "Non-preemptive", color: "amber" },
  { id: "SRTF", name: "SRTF", desc: "Shortest Remaining Time", badge: "Preemptive", color: "emerald" },
  { id: "Priority", name: "Priority (NP)", desc: "Priority order", badge: "Non-preemptive", color: "red" },
  { id: "PriorityP", name: "Priority (P)", desc: "Preemptive priority", badge: "Preemptive", color: "orange" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <LandingNav />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e2e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex-1 max-w-xl"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Free & Open Source
          </motion.div>
          <motion.h1
            variants={item}
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-6 leading-[1.1]"
          >
            Schedule Smarter.
            <br />
            Visualize Deeper.
          </motion.h1>
          <motion.p
            variants={item}
            className="text-slate-400 text-base md:text-lg max-w-xl mb-8 leading-relaxed"
          >
            An interactive CPU scheduling simulator. Add processes, pick an algorithm, and watch the OS come alive in real time.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Link
              href="/visualizer"
              className="shimmer-button inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all border border-violet-500/50"
            >
              Launch Simulator →
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white font-medium transition-all"
            >
              View Algorithms
            </Link>
          </motion.div>
          <motion.div
            variants={item}
            className="mt-8 py-2 overflow-hidden border-y border-slate-800/80"
          >
            <p className="text-xs text-slate-500 font-mono">
              FCFS · Round Robin · SJF · SRTF · Priority · Comparison Mode
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 flex-1 flex justify-center items-center"
        >
          <HeroCPUVisualizer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-slate-500 animate-bounce" />
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800/80 bg-schedos-surface/80 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-10 md:gap-16">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-violet-400" />
            <span className="text-slate-300 font-medium">6 Algorithms</span>
          </div>
          <div className="w-px h-6 bg-slate-700 hidden md:block" />
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-300 font-medium">Real-time Animation</span>
          </div>
          <div className="w-px h-6 bg-slate-700 hidden md:block" />
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span className="text-slate-300 font-medium">Gantt + Metrics</span>
          </div>
          <div className="w-px h-6 bg-slate-700 hidden md:block" />
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-300 font-medium">AI Assistant</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <span className="text-violet-300 text-sm font-medium">Two modes. One platform.</span>
          </div>
          <p className="text-slate-400 text-lg">Schedule processes or compare all algorithms at once.</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-24">
          {/* Feature 01 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="text-slate-500 font-mono text-sm">■ 01</span>
              <h3 className="font-display font-bold text-3xl md:text-4xl text-white mt-2 mb-4">
                Interactive Scheduler
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Add your own processes with custom arrival time, burst time, and priority. Pick any algorithm and watch the CPU execute them step-by-step with full timeline scrubbing.
              </p>
              <ul className="space-y-2 text-slate-400 text-sm mb-6">
                <li>⏱ Step-through or full playback</li>
                <li>🎯 Click to scrub the Gantt timeline</li>
                <li>📋 Real-time ready queue visualization</li>
                <li>📈 Instant metrics: WT, TAT, CPU%</li>
              </ul>
              <Link
                href="/visualizer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-300 font-medium transition-colors"
              >
                Try Scheduler →
              </Link>
            </div>
            <div className="schedos-card p-6 flex items-center justify-center min-h-[280px]">
              <div className="text-center text-slate-500">
                <Cpu className="w-16 h-16 mx-auto mb-3 text-violet-500/50" />
                <p className="text-sm">Simulator preview</p>
                <Link href="/visualizer" className="text-violet-400 text-sm mt-2 inline-block hover:underline">
                  Open Visualizer →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Feature 02 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 md:order-1 schedos-card p-6 flex items-center justify-center min-h-[280px]">
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                {["FCFS", "RR", "SJF", "SRTF", "Priority", "MLQ"].map((a, i) => (
                  <div
                    key={a}
                    className="p-3 rounded-lg bg-schedos-elevated border border-slate-700/80 text-center"
                  >
                    <span className="text-xs font-mono text-slate-400">{a}</span>
                    <p className="text-lg font-mono font-bold text-white mt-1">{i === 1 ? "1.67" : "—"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-slate-500 font-mono text-sm">■ 02</span>
              <h3 className="font-display font-bold text-3xl md:text-4xl text-white mt-2 mb-4">
                Algorithm Comparison
              </h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Run all 6 algorithms on the same process set simultaneously. Instantly see which gives the best average waiting time, turnaround time, and CPU utilization.
              </p>
              <Link
                href="/visualizer?tab=comparison"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-300 font-medium transition-colors"
              >
                Compare Algorithms →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Algorithms grid */}
      <section id="algorithms" className="py-24 px-6 bg-schedos-surface/50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl md:text-4xl text-white"
          >
            Explore the Algorithms
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALGOS.map((algo, i) => (
            <motion.div
              key={algo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={algo.id === "PriorityP" ? "/visualizer?algo=Priority" : `/visualizer?algo=${algo.id}`}
                className="block schedos-card p-6 hover:border-violet-500/40 hover:shadow-glow transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display font-bold text-lg text-white group-hover:text-violet-200 transition-colors">
                    {algo.name}
                  </h4>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      algo.badge === "Preemptive"
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {algo.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{algo.desc}</p>
                <span className="text-violet-400 text-sm font-medium group-hover:underline">
                  Try It →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SchedBot section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto schedos-card p-8 md:p-12 border-violet-500/20 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-schedos-elevated border border-violet-500/30 flex items-center justify-center">
              <Bot className="w-16 h-16 text-violet-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-2xl text-white mb-2">Meet SchedBot 🤖</h3>
            <p className="text-slate-400 mb-6">
              Confused about SRTF vs SJF? SchedBot explains it. Ask anything about CPU scheduling, algorithms, or your simulation results — in plain English.
            </p>
            <div className="space-y-3 mb-6 p-4 rounded-xl bg-schedos-elevated/80 border border-slate-700/80">
              <p className="text-xs text-slate-500">User: Why is my average waiting time so high?</p>
              <p className="text-sm text-slate-300">
                SchedBot: You have a long P1 at the front — classic FCFS convoy effect! Try switching to SJF. 🚀
              </p>
            </div>
            <Link
              href="/visualizer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
            >
              Get AI insights in the simulator →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <span className="text-violet-300 text-sm font-medium">Ready to visualize your OS?</span>
          </div>
          <p className="text-slate-400 mb-8">Free. Open source. No setup required.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/visualizer"
              className="shimmer-button inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all border border-violet-500/50"
            >
              Launch Simulator
            </Link>
            <a
              href="https://github.com/akashg7/CPU-Scheduling"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white font-medium transition-all"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
          <p className="text-xs text-slate-600 mt-8">
            Built with Next.js · TypeScript · Tailwind · Framer Motion
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-violet-400" />
            <span className="font-display font-bold text-white">Team 404</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            Understand your OS, one process at a time. © 2026 Team 404 — Built for learning
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/visualizer" className="text-slate-400 hover:text-white transition-colors">
              Visualizer
            </Link>
            <Link href="/#algorithms" className="text-slate-400 hover:text-white transition-colors">
              Algorithms
            </Link>
            <Link href="/guide" className="text-slate-400 hover:text-white transition-colors">
              Learn
            </Link>
            <a href="https://github.com/akashg7/CPU-Scheduling" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-slate-800/50">
          <p className="font-display font-bold text-4xl text-slate-800 tracking-tighter text-center">
            Team 404
          </p>
        </div>
      </footer>
    </div>
  );
}
