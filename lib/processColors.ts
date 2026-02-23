// Design tokens for process visualization (Hero CPU + Simulator CPU)
export const PROCESS_COLORS: Record<
  string,
  { bg: string; glow: string; dark: string; label: string }
> = {
  P1: {
    bg: "#06B6D4",
    glow: "rgba(6,182,212,0.6)",
    dark: "rgba(6,182,212,0.15)",
    label: "#E0F7FA",
  },
  P2: {
    bg: "#F59E0B",
    glow: "rgba(245,158,11,0.6)",
    dark: "rgba(245,158,11,0.15)",
    label: "#FFF8E1",
  },
  P3: {
    bg: "#10B981",
    glow: "rgba(16,185,129,0.6)",
    dark: "rgba(16,185,129,0.15)",
    label: "#E8F5E9",
  },
  P4: {
    bg: "#EF4444",
    glow: "rgba(239,68,68,0.6)",
    dark: "rgba(239,68,68,0.15)",
    label: "#FFEBEE",
  },
  P5: {
    bg: "#8B5CF6",
    glow: "rgba(139,92,246,0.6)",
    dark: "rgba(139,92,246,0.15)",
    label: "#F3E8FF",
  },
  P6: {
    bg: "#EC4899",
    glow: "rgba(236,72,153,0.6)",
    dark: "rgba(236,72,153,0.15)",
    label: "#FCE4EC",
  },
};

const FALLBACK = {
  bg: "#06B6D4",
  glow: "rgba(6,182,212,0.6)",
  dark: "rgba(6,182,212,0.15)",
  label: "#E0F7FA",
};

export function getProcessColor(
  processId: string
): { bg: string; glow: string; dark: string; label: string } {
  return PROCESS_COLORS[processId] ?? FALLBACK;
}
