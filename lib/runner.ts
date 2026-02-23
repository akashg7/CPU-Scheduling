import { AlgorithmType, Process, SimulationResult, AlgorithmOptions } from "./types";
import { fcfs, sjf, srtf, rr, mlq } from "./algorithms";
import { priority } from "./algorithms/priority";

export const runSimulation = (
    algorithm: AlgorithmType,
    processes: Process[],
    options?: AlgorithmOptions
): SimulationResult => {
    switch (algorithm) {
        case 'FCFS':
            return fcfs(processes);
        case 'SJF':
            return sjf(processes);
        case 'SRTF':
            return srtf(processes);
        case 'Priority':
            return priority(processes);
        case 'RR':
            return rr(processes, options);
        case 'SRJF':
            return srtf(processes); // SRJF = SRTF (same algorithm)
        case 'MLQ':
            // Classic multi-level queue: no feedback or aging by default
            return mlq(processes, {
                ...options,
                mlqConfig: {
                    q1TimeQuantum: options?.mlqConfig?.q1TimeQuantum ?? 2,
                    q2TimeQuantum: options?.mlqConfig?.q2TimeQuantum ?? 4,
                    feedbackEnabled: false,
                    agingEnabled: false,
                    agingThreshold: options?.mlqConfig?.agingThreshold ?? 9999,
                },
            });
        case 'MLFQ':
            // Multi-level feedback queue (macOS-style)
            return mlq(processes, options);
        default:
            return fcfs(processes);
    }
};
