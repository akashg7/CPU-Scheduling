import { AlgorithmType, Process, SimulationResult, AlgorithmOptions } from "./types";
import { fcfs, sjf, priority, rr, srjf } from "./algorithms";

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
        // case 'Priority':
        //     return priority(processes);
        case 'RR':
            return rr(processes, options);
        // case 'SRJF':
        //     return srjf(processes);
        default:
            return fcfs(processes);
    }
};
