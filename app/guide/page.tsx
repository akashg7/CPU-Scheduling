"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, BookOpen } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    shortTitle: "Overview",
  },
  {
    id: "fcfs",
    title: "FCFS — First Come First Serve",
    shortTitle: "FCFS",
    badge: "Non-preemptive",
    body: "Processes are executed in the order they arrive. The first process to arrive is the first to get the CPU. Simple and fair in order, but can cause the \"convoy effect\": one long process at the front makes everyone else wait.",
    pros: ["Simple to implement", "No starvation", "Predictable order"],
    cons: ["Convoy effect", "Poor average waiting time", "No priority"],
  },
  {
    id: "rr",
    title: "Round Robin",
    shortTitle: "Round Robin",
    badge: "Preemptive",
    body: "Each process gets a fixed time slice (quantum). When the quantum expires, the process is preempted and moved to the back of the ready queue. Fair and good for time-sharing; tuning the quantum is critical.",
    pros: ["Fair", "Good response time", "No starvation"],
    cons: ["Context switch overhead", "Quantum choice matters"],
  },
  {
    id: "sjf",
    title: "SJF — Shortest Job First",
    shortTitle: "SJF",
    badge: "Non-preemptive",
    body: "The process with the smallest burst time runs next. Minimizes average waiting time but requires knowing (or estimating) burst times. Long jobs can starve if short jobs keep arriving.",
    pros: ["Optimal average waiting time (non-preemptive)", "Efficient"],
    cons: ["Starvation of long jobs", "Burst time must be known"],
  },
  {
    id: "srtf",
    title: "SRTF — Shortest Remaining Time First",
    shortTitle: "SRTF",
    badge: "Preemptive",
    body: "Preemptive version of SJF. At any time, the process with the smallest remaining burst time runs. If a new process arrives with a shorter remaining time, it preempts the current process.",
    pros: ["Optimal average waiting time", "Responsive to short jobs"],
    cons: ["Starvation possible", "Overhead from preemption"],
  },
  {
    id: "priority",
    title: "Priority Scheduling",
    shortTitle: "Priority",
    badge: "Preemptive & Non-preemptive",
    body: "Each process has a priority; lower number often means higher priority. The CPU runs the highest-priority ready process. Can be preemptive (new higher-priority job preempts) or non-preemptive.",
    pros: ["Flexible", "Important jobs first"],
    cons: ["Starvation of low priority", "Priority inversion risk"],
  },
  {
    id: "mlq",
    title: "MLQ — Multi-Level Queue",
    shortTitle: "MLQ",
    badge: "Static queues",
    body: "Processes are assigned to fixed priority queues (e.g. System, Interactive, Batch). The scheduler always serves the highest-priority non-empty queue first; within a queue, Round Robin is typically used. Processes never move between queues—assignment is static.",
    pros: ["Clear separation of workload types", "High-priority queues get preference", "Simple queue assignment"],
    cons: ["No feedback—long batch jobs can starve", "Rigid structure", "Queue assignment must be decided upfront"],
  },
  {
    id: "mlfq",
    title: "MLFQ — Multi-Level Feedback Queue",
    shortTitle: "MLFQ",
    badge: "Preemptive, adaptive",
    body: "Like MLQ but with feedback: processes can move between queues. A process that uses its time quantum is demoted to a lower-priority queue; processes that wait too long in lower queues can be promoted (aging). Used in many real OSs (e.g. macOS) to balance responsiveness and throughput.",
    pros: ["Responsive to short interactive jobs", "Long batch jobs don't block short ones", "Aging prevents starvation"],
    cons: ["Tuning quantums and aging is complex", "Demotion can hurt I/O-bound jobs", "Many parameters to configure"],
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100">
      <LandingNav />

      <div className="flex pt-16">
        {/* Left sidebar — documentation TOC */}
        <aside
          className="hidden lg:block w-64 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-slate-800 bg-schedos-base/50"
          aria-label="Table of contents"
        >
          <nav className="py-8 pr-4 pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-4 px-3">
              On this page
            </p>
            <ul className="space-y-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-2 px-3 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border-l-2 border-transparent hover:border-violet-500/50"
                  >
                    {s.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                href="/visualizer"
                className="flex items-center gap-2 py-2 px-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Open Simulator
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
            {/* Page title */}
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-violet-400" />
              <div>
                <h1 className="font-display font-bold text-3xl text-white">
                  CPU Scheduling
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Learn how each algorithm works and when to use it.
                </p>
              </div>
            </div>

            {/* Overview */}
            <section id="overview" className="scroll-mt-24 mb-16">
              <h2 className="font-display font-bold text-xl text-white mb-4">
                Overview
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                CPU scheduling decides which process runs next when the CPU is free. Different algorithms optimize for fairness, throughput, response time, or priority. This guide covers the algorithms available in the Team 404 simulator.
              </p>
              <div className="p-4 rounded-xl bg-schedos-elevated border border-slate-800 font-mono text-xs text-slate-400">
                <p className="text-slate-500 mb-1">Key formulas</p>
                <p>TAT = CT − AT &nbsp;&nbsp;|&nbsp;&nbsp; WT = TAT − BT &nbsp;&nbsp;|&nbsp;&nbsp; (Turnaround = Completion − Arrival; Waiting = TAT − Burst)</p>
              </div>
            </section>

            {/* Algorithm sections */}
            <div className="space-y-16">
              {SECTIONS.filter((s) => s.id !== "overview").map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {section.badge}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {section.body}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                        Pros
                      </p>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {section.pros!.map((p) => (
                          <li key={p}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                      <p className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mb-2">
                        Cons
                      </p>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {section.cons!.map((c) => (
                          <li key={c}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href="/visualizer"
                    className="inline-flex items-center gap-2 text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
                  >
                    Try in Simulator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.section>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 pt-10 border-t border-slate-800">
              <Link
                href="/visualizer"
                className="shimmer-button inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all border border-violet-500/50"
              >
                <Cpu className="w-5 h-5" />
                Open Simulator
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
