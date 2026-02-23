"use client";

import { motion } from "framer-motion";

const ORBS = [
  { id: "P1", color: "#06B6D4" },
  { id: "P2", color: "#F59E0B" },
  { id: "P3", color: "#10B981" },
];

const RADIUS = 72;

export function OrbitingProcesses() {
  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      {/* Central CPU */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 30px rgba(124,58,237,0.4)",
            "0 0 50px rgba(124,58,237,0.6)",
            "0 0 30px rgba(124,58,237,0.4)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute z-10 w-[88px] h-[88px] rounded-2xl bg-schedos-surface border-2 border-violet-500/60 flex items-center justify-center"
      >
        <span className="font-mono font-bold text-violet-300 text-sm">CPU</span>
      </motion.div>

      {/* Orbiting process bubbles — parent rotates */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {ORBS.map((orb, i) => {
          const angle = (i * 120 * Math.PI) / 180;
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          return (
            <motion.div
              key={orb.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="absolute w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-white text-xs border-2"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                marginLeft: "-24px",
                marginTop: "-24px",
                backgroundColor: orb.color,
                borderColor: orb.color,
                boxShadow: `0 0 16px ${orb.color}50`,
              }}
            >
              {orb.id}
            </motion.div>
          );
        })}
      </motion.div>

      <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-mono whitespace-nowrap">
        3 processes queued · 1 running · FCFS mode
      </p>
    </div>
  );
}
