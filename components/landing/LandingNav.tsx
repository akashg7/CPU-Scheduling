"use client";

import Link from "next/link";
import { Cpu, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const MOBILE_LINKS = [
  { href: "/visualizer", label: "Visualizer" },
  { href: "/#algorithms", label: "Algorithms" },
  { href: "/guide", label: "Learn" },
  { href: "/visualizer?tab=comparison", label: "Compare" },
  { href: "https://github.com/akashg7/CPU-Scheduling", label: "GitHub", external: true },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5"
      style={{ paddingLeft: "max(1rem, env(safe-area-inset-left))", paddingRight: "max(1rem, env(safe-area-inset-right))" }}
    >
      <Link href="/" className="flex items-center gap-2 group min-w-0">
        <div className="relative flex-shrink-0">
          <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-violet-400 group-hover:text-violet-300 transition-colors" />
          <span className="absolute inset-0 animate-ping opacity-20 rounded-full bg-violet-500" style={{ animationDuration: "2s" }} />
        </div>
        <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white truncate">Team 404</span>
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
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
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
          className="shimmer-button px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all border border-violet-500/50 min-h-[40px] flex items-center"
        >
          Launch App →
        </Link>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0F]/98 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <ul className="py-3 px-4 space-y-0">
              {MOBILE_LINKS.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-3 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
