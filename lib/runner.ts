import { AlgorithmType, Process, SimulationResult, AlgorithmOptions } from "./types";
import { fcfs, sjf, rr } from "./algorithms";
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
        case 'Priority':
            return priority(processes);
        case 'RR':
            return rr(processes, options);
        // case 'SRJF':
        //     return srjf(processes);
        default:
            return fcfs(processes);
    }
};
