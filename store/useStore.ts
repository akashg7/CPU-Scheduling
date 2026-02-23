import { create } from 'zustand';
import { Process, AlgorithmType, SimulationResult, MLQConfig } from '@/lib/types';
import { runSimulation } from '@/lib/runner';
import { ALGORITHM_EXAMPLES } from '@/lib/examples';

interface AppState {
    processes: Process[];
    algorithm: AlgorithmType;
    timeQuantum: number;
    mlqConfig: MLQConfig;
    results: SimulationResult | null;
    isPlaying: boolean;
    simulationSpeed: number; // 1x, 2x, etc.
    currentTime: number;
    totalDuration: number;

    // Actions
    addProcess: (process: Process) => void;
    removeProcess: (id: string) => void;
    updateProcess: (id: string, updates: Partial<Process>) => void;
    setAlgorithm: (algo: AlgorithmType) => void;
    setTimeQuantum: (q: number) => void;
    setMLQConfig: (config: Partial<MLQConfig>) => void;
    setSimulationSpeed: (speed: number) => void;
    setCurrentTime: (time: number) => void;
    togglePlayback: () => void;
    run: () => void;
    loadExample: (algo: AlgorithmType) => void;
    setProcesses: (processes: Process[]) => void;
    reset: () => void; // Reset simulation
    step: () => void;
    stepBack: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    processes: [
        { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 1, color: '#3b82f6', queueLevel: 1 },
        { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 2, color: '#10b981', queueLevel: 2 },
        { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3, color: '#f59e0b', queueLevel: 3 },
    ],
    algorithm: 'FCFS',
    timeQuantum: 2,
    mlqConfig: { q1TimeQuantum: 2, q2TimeQuantum: 4, feedbackEnabled: true, agingEnabled: true, agingThreshold: 8 },
    results: null,
    isPlaying: false,
    simulationSpeed: 1,
    currentTime: 0,
    totalDuration: 0,

    addProcess: (process) => set((state) => ({
        processes: [...state.processes, process]
    })),

    removeProcess: (id) => set((state) => ({
        processes: state.processes.filter(p => p.id !== id)
    })),

    updateProcess: (id, updates) => set((state) => ({
        processes: state.processes.map(p => p.id === id ? { ...p, ...updates } : p)
    })),

    setAlgorithm: (algo) => set({ algorithm: algo }),
    setTimeQuantum: (q) => set({ timeQuantum: q }),
    setMLQConfig: (config) => set((state) => ({ mlqConfig: { ...state.mlqConfig, ...config } })),
    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
    setCurrentTime: (time) => set({ currentTime: time }),
    togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setProcesses: (processes: Process[]) => set({ processes }),

    loadExample: (algo) => {
        const example = ALGORITHM_EXAMPLES[algo];
        if (!example) return;
        const updates: Partial<AppState> = {
            processes: example.processes,
            algorithm: algo,
            currentTime: 0,
            isPlaying: false,
        };
        if (example.recommendedTimeQuantum) {
            updates.timeQuantum = example.recommendedTimeQuantum;
        }
        if (example.recommendedMLQConfig) {
            updates.mlqConfig = example.recommendedMLQConfig;
        }
        set(updates);
    },

    run: () => {
        const { processes, algorithm, timeQuantum, mlqConfig } = get();
        const results = runSimulation(algorithm, processes, { timeQuantum, mlqConfig });
        const lastBlock = results.ganttChart[results.ganttChart.length - 1];
        const totalDuration = lastBlock ? lastBlock.endTime : 0;
        set({ results, totalDuration, currentTime: 0, isPlaying: false });
    },

    step: () => {
        const { currentTime, totalDuration } = get();
        if (currentTime < totalDuration) {
            set({ currentTime: Math.min(currentTime + 1, totalDuration) });
        }
    },

    stepBack: () => {
        const { currentTime } = get();
        if (currentTime > 0) {
            set({ currentTime: Math.max(0, currentTime - 1) });
        }
    },

    reset: () => set({ results: null, isPlaying: false, processes: [], currentTime: 0, totalDuration: 0 }),
}));
