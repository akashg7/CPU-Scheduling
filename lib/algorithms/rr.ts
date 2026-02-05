import { Process, SimulationResult, ScheduledBlock, SimulationMetric, SystemSnapshot, AlgorithmOptions } from "../types";

export const rr = (processes: Process[], options?: AlgorithmOptions): SimulationResult => {
    const timeQuantum = options?.timeQuantum || 2;
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const remainingBurst = new Map<string, number>();
    processes.forEach(p => remainingBurst.set(p.id, p.burstTime));

    const ganttChart: ScheduledBlock[] = [];
    const metrics: SimulationMetric[] = [];
    const snapshots: SystemSnapshot[] = [];
    const logs: import("../types").SystemLog[] = [];

    let currentTime = 0;
    const completedProcessIds: string[] = [];
    const readyQueue: string[] = [];

    // Track first response time
    const firstStartTime = new Map<string, number>();

    // Add initial processes arriving at 0
    let arrivalIndex = 0;
    while (arrivalIndex < sortedProcesses.length && sortedProcesses[arrivalIndex].arrivalTime <= currentTime) {
        readyQueue.push(sortedProcesses[arrivalIndex].id);
        arrivalIndex++;
    }

    // If queue empty but processes left, jump to next arrival
    if (readyQueue.length === 0 && arrivalIndex < sortedProcesses.length) {
        currentTime = sortedProcesses[arrivalIndex].arrivalTime;
        while (arrivalIndex < sortedProcesses.length && sortedProcesses[arrivalIndex].arrivalTime <= currentTime) {
            readyQueue.push(sortedProcesses[arrivalIndex].id);
            arrivalIndex++;
        }
    }

    // Initial Snapshot
    snapshots.push({
        time: currentTime,
        readyQueue: [...readyQueue],
        runningProcessId: null,
        completedProcessIds: []
    });

    while (readyQueue.length > 0) {
        const currentId = readyQueue.shift()!;
        const process = processes.find(p => p.id === currentId)!;

        // Check if first run
        if (!firstStartTime.has(currentId)) {
            firstStartTime.set(currentId, currentTime);
        }

        const burstLeft = remainingBurst.get(currentId)!;
        const runTime = Math.min(burstLeft, timeQuantum);

        const startTime = currentTime;
        const endTime = startTime + runTime;

        ganttChart.push({
            processId: currentId,
            startTime,
            endTime,
            color: process.color
        });

        remainingBurst.set(currentId, burstLeft - runTime);

        // Add arrivals during this run time to queue
        // Careful: standard RR adds arrivals BEFORE re-adding current process
        // Arrivals from (currentTime, endTime]
        for (let i = arrivalIndex; i < sortedProcesses.length; i++) {
            const p = sortedProcesses[i];
            if (p.arrivalTime > currentTime && p.arrivalTime <= endTime) {
                readyQueue.push(p.id);
                arrivalIndex++;
            } else if (p.arrivalTime > endTime) {
                break;
            }
        }

        // If not finished, re-add to queue
        if (remainingBurst.get(currentId)! > 0) {
            readyQueue.push(currentId);
        } else {
            // Completed through quantum
            completedProcessIds.push(currentId);
            const completionTime = endTime;
            const turnaroundTime = completionTime - process.arrivalTime;
            const waitingTime = turnaroundTime - process.burstTime;
            const responseTime = firstStartTime.get(currentId)! - process.arrivalTime;

            metrics.push({
                processId: currentId,
                waitingTime,
                turnaroundTime,
                completionTime,
                responseTime
            });
        }

        currentTime = endTime;

        // If queue empty but processes left, jump
        if (readyQueue.length === 0 && arrivalIndex < sortedProcesses.length) {
            const nextArrival = sortedProcesses[arrivalIndex].arrivalTime;
            // Idle from currentTime to nextArrival
            currentTime = nextArrival;
            while (arrivalIndex < sortedProcesses.length && sortedProcesses[arrivalIndex].arrivalTime <= currentTime) {
                readyQueue.push(sortedProcesses[arrivalIndex].id);
                arrivalIndex++;
            }
        }

        // Snapshot
        snapshots.push({
            time: currentTime,
            readyQueue: [...readyQueue],
            runningProcessId: remainingBurst.get(currentId)! > 0 ? null : null,
            completedProcessIds: [...completedProcessIds]
        });

        // Log logic
        if (remainingBurst.get(currentId)! > 0) {
            logs.push({
                time: endTime,
                message: `Process ${currentId} time quantum expired. Re-queued.`,
                type: 'info'
            });
        } else {
            logs.push({
                time: endTime,
                message: `Process ${currentId} completed execution.`,
                type: 'success'
            });
        }
    }

    return { ganttChart, metrics, snapshots, logs };
};
