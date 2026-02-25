"use client";

import { useState, useEffect, useRef } from "react";
import { getProcessColor } from "@/lib/processColors";

export function HeroCPUVisualizer() {
  const [tick, setTick] = useState(0);
  const [activeProcess, setActiveProcess] = useState("P1");
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      setRotation((elapsed / 6000) * 360);
      setTick(elapsed);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const processes = ["P1", "P2", "P3"];
    const idx = Math.floor(tick / 2000) % processes.length;
    setActiveProcess(processes[idx]);
  }, [tick]);

  const processes = ["P1", "P2", "P3"];
  const orbitRadius = 130;

  return (
    <div
      className="relative flex items-center justify-center w-full max-w-[min(380px,85vw)] aspect-square"
      style={{ maxHeight: "min(380px, 85vw)" }}
    >
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 380 380"
      >
        <circle
          cx={190}
          cy={190}
          r={orbitRadius}
          fill="none"
          stroke="rgba(124,58,237,0.15)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        <circle
          cx={190}
          cy={190}
          r={170}
          fill="none"
          stroke="rgba(124,58,237,0.06)"
          strokeWidth={1}
        />
        <circle
          cx={190}
          cy={190}
          r={80}
          fill="none"
          stroke="rgba(6,182,212,0.08)"
          strokeWidth={1}
        />
        <circle
          cx={190}
          cy={190}
          r={orbitRadius}
          fill="none"
          stroke="url(#orbitGradient)"
          strokeWidth={2}
          strokeDasharray={`${orbitRadius * 0.8} ${orbitRadius * 10}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{
            transformOrigin: "190px 190px",
            transform: `rotate(${rotation}deg)`,
          }}
        />
        <defs>
          <radialGradient id="cpuGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.4)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </radialGradient>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(124,58,237,0)" />
            <stop offset="50%" stopColor="rgba(124,58,237,0.8)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.4)" />
          </linearGradient>
          <filter id="heroGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroSoftGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx={190} cy={190} rx={90} ry={90} fill="url(#cpuGlow)" />
        {processes.map((pid, i) => {
          const angle =
            ((i / processes.length) * 360 + rotation * 0.5) * (Math.PI / 180);
          const x = 190 + orbitRadius * Math.cos(angle);
          const y = 190 + orbitRadius * Math.sin(angle);
          const isActive = pid === activeProcess;
          const color = getProcessColor(pid);
          return (
            <line
              key={pid}
              x1={190}
              y1={190}
              x2={x}
              y2={y}
              stroke={
                isActive ? color.bg : "rgba(255,255,255,0.04)"
              }
              strokeWidth={isActive ? 1.5 : 0.5}
              strokeDasharray={isActive ? "3 4" : "2 8"}
              style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
            />
          );
        })}
        {processes.map((pid, i) => {
          const angle =
            ((i / processes.length) * 360 + rotation * 0.5) * (Math.PI / 180);
          const x = 190 + orbitRadius * Math.cos(angle);
          const y = 190 + orbitRadius * Math.sin(angle);
          const color = getProcessColor(pid);
          const isActive = pid === activeProcess;
          const nodeSize = isActive ? 34 : 28;
          return (
            <g
              key={pid}
              filter={isActive ? "url(#heroSoftGlow)" : undefined}
            >
              <circle
                cx={x}
                cy={y}
                r={nodeSize + 8}
                fill={isActive ? color.glow : "transparent"}
                style={{ transition: "fill 0.5s" }}
              />
              <rect
                x={x - nodeSize / 2}
                y={y - nodeSize / 2}
                width={nodeSize}
                height={nodeSize}
                rx={8}
                fill={isActive ? color.bg : color.dark}
                stroke={color.bg}
                strokeWidth={isActive ? 2 : 1}
                style={{ transition: "all 0.5s" }}
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="white"
                fontSize={isActive ? 13 : 11}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                style={{ transition: "font-size 0.5s" }}
              >
                {pid}
              </text>
              {isActive && (
                <circle
                  cx={x}
                  cy={y}
                  r={nodeSize + 14}
                  fill="none"
                  stroke={color.bg}
                  strokeWidth={1}
                  opacity={0.4}
                  style={{ animation: "pulseRing 1.5s ease-out infinite" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Central CPU Core */}
      <div
        className="absolute z-10 flex flex-col items-center justify-center gap-0.5"
        style={{
          width: 130,
          height: 130,
          borderRadius: 22,
          background: "linear-gradient(135deg, #0D0D1A 0%, #111128 100%)",
          boxShadow: `
            0 0 0 1px rgba(124,58,237,0.5),
            0 0 0 2px rgba(124,58,237,0.2),
            0 0 40px rgba(124,58,237,0.3),
            inset 0 1px 0 rgba(255,255,255,0.07)
          `,
        }}
      >
        <div
          className="absolute -inset-0.5 rounded-3xl -z-10"
          style={{
            background: `conic-gradient(from ${rotation}deg, transparent 0%, rgba(124,58,237,0.8) 20%, rgba(6,182,212,0.6) 40%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-px rounded-[21px] -z-10"
          style={{ background: "#0D0D1A" }}
        />
        <div
          className="absolute inset-3 grid gap-0.5 opacity-[0.12]"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="rounded-sm bg-violet-500/80"
              style={{ borderRadius: 2 }}
            />
          ))}
        </div>
        <div
          className="font-mono text-[10px] uppercase tracking-widest text-violet-400/80 mb-0.5"
          style={{ letterSpacing: "0.2em" }}
        >
          CORE
        </div>
        <div className="font-mono text-[28px] font-extrabold leading-none tracking-tight text-white">
          CPU
        </div>
        <div
          className="font-mono text-[9px] mt-0.5 transition-colors duration-500"
          style={{
            color: getProcessColor(activeProcess).bg,
            letterSpacing: "0.15em",
          }}
        >
          {activeProcess} ● EXEC
        </div>
      </div>

      <p
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center font-mono text-[10px] sm:text-[11px] text-slate-500 px-2"
        style={{ letterSpacing: "0.1em" }}
      >
        3 processes queued · 1 running · FCFS mode
      </p>
    </div>
  );
}
