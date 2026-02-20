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
            return mlq(processes, options);
        default:
            return fcfs(processes);
    }
};
