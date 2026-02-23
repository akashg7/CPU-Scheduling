"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative">
          <Cpu className="w-8 h-8 text-violet-400 group-hover:text-violet-300 transition-colors" />
          <span className="absolute inset-0 animate-ping opacity-20 rounded-full bg-violet-500" style={{ animationDuration: "2s" }} />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-white">Team 404</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/visualizer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Visualizer
        </Link>
        <Link href="/#algorithms" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Algorithms
        </Link>
        <Link href="/guide" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Learn
        </Link>
        <Link href="/visualizer?tab=comparison" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Compare
        </Link>
        <Link href="/visualizer" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5" title="Get AI insights in the simulator">

        </Link>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/akashg7/CPU-Scheduling"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:inline"
        >
          GitHub
        </a>
        <Link
          href="/visualizer"
          className="shimmer-button px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all border border-violet-500/50"
        >
          Launch App →
        </Link>
      </div>
    </motion.nav>
  );
}
