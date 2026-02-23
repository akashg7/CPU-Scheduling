"use client";

import { useState, useEffect, useRef } from "react";
import { getProcessColor } from "@/lib/processColors";

interface SimulatorCPUProps {
  processId?: string;
  isIdle?: boolean;
}

export function SimulatorCPU({ processId = "P1", isIdle = false }: SimulatorCPUProps) {
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      setRotation((elapsed / 4000) * 360);
      setPulse(Math.sin(elapsed / 600));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const color = !isIdle ? getProcessColor(processId) : null;
  const glowColor = isIdle ? "rgba(71,85,105,0.4)" : color!.glow;
  const borderColor = isIdle ? "rgba(71,85,105,0.6)" : color!.bg;
  const labelColor = isIdle ? "#475569" : color!.bg;
  const pulseIntensity = isIdle ? 0 : 0.5 + pulse * 0.2;

  const gradientId = `spinGradSim-${processId}-${isIdle}`;

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-schedos-elevated px-5 py-6"
      style={{ minWidth: 220 }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-widest text-slate-500"
        style={{ letterSpacing: "0.25em" }}
      >
        Active CPU
      </div>

      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg
          className="absolute inset-0 overflow-visible"
          width={140}
          height={140}
          viewBox="0 0 140 140"
        >
          <defs>
            <filter id="simGlow">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                stopColor={isIdle ? "rgba(71,85,105,0)" : "transparent"}
              />
              <stop
                offset="50%"
                stopColor={isIdle ? "rgba(71,85,105,0.8)" : color!.bg}
              />
              <stop
                offset="100%"
                stopColor={isIdle ? "rgba(71,85,105,0)" : "transparent"}
              />
            </linearGradient>
          </defs>

          {!isIdle && (
            <circle
              cx={70}
              cy={70}
              r={66}
              fill="none"
              stroke={color!.bg}
              strokeWidth={1}
              opacity={0.15 + pulseIntensity * 0.1}
            />
          )}

          <circle
            cx={70}
            cy={70}
            r={62}
            fill="none"
            stroke={
              isIdle ? "rgba(71,85,105,0.2)" : "rgba(255,255,255,0.04)"
            }
            strokeWidth={2}
          />
          <circle
            cx={70}
            cy={70}
            r={62}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={2.5}
            strokeDasharray={`${62 * 2 * Math.PI * 0.4} ${62 * 2 * Math.PI * 0.6}`}
            strokeLinecap="round"
            style={{
              transformOrigin: "70px 70px",
              transform: `rotate(${rotation}deg)`,
            }}
          />

          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r1 = 54,
              r2 = 60;
            return (
              <line
                key={i}
                x1={70 + r1 * Math.cos(a)}
                y1={70 + r1 * Math.sin(a)}
                x2={70 + r2 * Math.cos(a)}
                y2={70 + r2 * Math.sin(a)}
                stroke={
                  isIdle ? "rgba(71,85,105,0.3)" : color!.bg
                }
                strokeWidth={i % 3 === 0 ? 2 : 1}
                opacity={i % 3 === 0 ? 0.6 : 0.2}
              />
            );
          })}

          {!isIdle && (
            <circle
              cx={70}
              cy={70}
              r={45}
              fill={color!.dark}
              filter="url(#simGlow)"
              opacity={0.6 + pulseIntensity * 0.3}
            />
          )}
        </svg>

        <div
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-[18px] transition-[border-color,box-shadow] duration-500"
          style={{
            width: 96,
            height: 96,
            background: "linear-gradient(135deg, #0A0A0F 0%, #111128 100%)",
            border: `1.5px solid ${borderColor}`,
            boxShadow: `0 0 24px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          }}
        >
          <div
            className="absolute inset-2.5 grid gap-0.5 opacity-[0.08]"
            style={{
              gridTemplateColumns: "repeat(3,1fr)",
              gridTemplateRows: "repeat(3,1fr)",
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{ background: labelColor, borderRadius: 2 }}
              />
            ))}
          </div>

          {!isIdle ? (
            <div
              className="font-mono text-[30px] font-extrabold leading-none tracking-tight transition-colors duration-500"
              style={{
                color: color!.bg,
                textShadow: `0 0 20px ${color!.glow}`,
                letterSpacing: "-0.03em",
              }}
            >
              {processId}
            </div>
          ) : (
            <div
              className="font-mono text-xs text-slate-500"
              style={{ letterSpacing: "0.1em" }}
            >
              IDLE
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
        style={{
          background: isIdle ? "rgba(71,85,105,0.1)" : color!.dark,
          border: `1px solid ${isIdle ? "rgba(71,85,105,0.3)" : color!.bg + "4D"}`,
        }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: isIdle ? "#475569" : color!.bg,
            boxShadow: isIdle ? "none" : `0 0 8px ${color!.glow}`,
            animation: isIdle ? "none" : "simBlink 1s ease-in-out infinite",
          }}
        />
        <span
          className="font-mono text-[11px] font-bold tracking-wider"
          style={{
            letterSpacing: "0.15em",
            color: isIdle ? "#475569" : color!.bg,
          }}
        >
          {isIdle ? "IDLE" : "RUNNING"}
        </span>
      </div>
    </div>
  );
}
