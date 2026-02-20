import { Process, SimulationResult, ScheduledBlock, SimulationMetric, SystemSnapshot, SystemLog, AlgorithmOptions } from "../types";

const QUEUE_NAMES: Record<number, string> = {
    1: "System (Q1)",
    2: "Interactive (Q2)",
    3: "Batch (Q3)",
};

const QUEUE_ALGOS: Record<number, string> = {
    1: "Round Robin",
    2: "Round Robin",
    3: "FCFS",
};

export const mlq = (processes: Process[], options?: AlgorithmOptions): SimulationResult => {
    const q1Quantum = options?.mlqConfig?.q1TimeQuantum ?? 2;
    const q2Quantum = options?.mlqConfig?.q2TimeQuantum ?? 4;

    // Assign queue levels (default to Q3 if not set)
    const procs = processes.map(p => ({
        ...p,
        queueLevel: (p.queueLevel ?? 3) as 1 | 2 | 3,
    }));

    // Sort each queue by arrival time
    const sortedAll = [...procs].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const ganttChart: ScheduledBlock[] = [];
    const metrics: SimulationMetric[] = [];
    const snapshots: SystemSnapshot[] = [];
    const logs: SystemLog[] = [];

    // Track remaining burst for each process (needed for RR preemption in Q1/Q2)
    const remainingBurst = new Map<string, number>();
    procs.forEach(p => remainingBurst.set(p.id, p.burstTime));

    // Track first response time
    const firstStartTime = new Map<string, number>();

    // Per-queue ready queues (FIFO order)
    const queues: Record<number, string[]> = { 1: [], 2: [], 3: [] };

    const completedProcessIds: string[] = [];
    let currentTime = 0;
    let arrivalIndex = 0;

    // Helper: add newly arrived processes to their queues
    const addArrivals = (upToTime: number) => {
        while (arrivalIndex < sortedAll.length && sortedAll[arrivalIndex].arrivalTime <= upToTime) {
            const p = sortedAll[arrivalIndex];
            queues[p.queueLevel].push(p.id);
            arrivalIndex++;
        }
    };

    // Helper: get the highest non-empty queue level, or null
    const highestQueue = (): number | null => {
        if (queues[1].length > 0) return 1;
        if (queues[2].length > 0) return 2;
        if (queues[3].length > 0) return 3;
        return null;
    };

    // Helper: get all ready IDs across queues
    const allReadyIds = (): string[] => [...queues[1], ...queues[2], ...queues[3]];

    // Initial arrivals at t=0
    addArrivals(0);

    // Initial snapshot
    snapshots.push({
        time: 0,
        readyQueue: allReadyIds(),
        runningProcessId: null,
        completedProcessIds: [],
    });

    // Main scheduling loop
    while (completedProcessIds.length < procs.length) {
        let qLevel = highestQueue();

        // If all queues empty, jump to next arrival
        if (qLevel === null) {
            if (arrivalIndex < sortedAll.length) {
                currentTime = sortedAll[arrivalIndex].arrivalTime;
                addArrivals(currentTime);
                qLevel = highestQueue();
                if (qLevel === null) break; // safety
            } else {
                break;
            }
        }

        const currentId = queues[qLevel].shift()!;
        const process = procs.find(p => p.id === currentId)!;
        const burstLeft = remainingBurst.get(currentId)!;

        // Determine run time based on queue algorithm
        let runTime: number;
        if (qLevel === 1) {
            runTime = Math.min(burstLeft, q1Quantum);
        } else if (qLevel === 2) {
            runTime = Math.min(burstLeft, q2Quantum);
        } else {
            // Q3: FCFS — runs to completion (but can be preempted by higher queue arrival)
            runTime = burstLeft;
        }

        // For Q3 (FCFS), check if a higher-priority process arrives mid-execution
        // If so, preempt at that point
        if (qLevel === 3) {
            let preemptTime = currentTime + runTime;
            for (let i = arrivalIndex; i < sortedAll.length; i++) {
                const p = sortedAll[i];
                if (p.arrivalTime > currentTime && p.arrivalTime < preemptTime && (p.queueLevel === 1 || p.queueLevel === 2)) {
                    preemptTime = p.arrivalTime;
                    break;
                }
            }
            runTime = Math.min(runTime, preemptTime - currentTime);
        }

        // Also for Q2, check if Q1 process arrives and should preempt
        if (qLevel === 2) {
            let preemptTime = currentTime + runTime;
            for (let i = arrivalIndex; i < sortedAll.length; i++) {
                const p = sortedAll[i];
                if (p.arrivalTime > currentTime && p.arrivalTime < preemptTime && p.queueLevel === 1) {
                    preemptTime = p.arrivalTime;
                    break;
                }
            }
            runTime = Math.min(runTime, preemptTime - currentTime);
        }

        if (runTime <= 0) runTime = 1; // safety — at least 1 unit

        // Track first response
        if (!firstStartTime.has(currentId)) {
            firstStartTime.set(currentId, currentTime);
        }

        const startTime = currentTime;
        const endTime = startTime + runTime;

        // Gantt block
        ganttChart.push({
            processId: currentId,
            startTime,
            endTime,
            color: process.color,
        });

        // Snapshot at start
        snapshots.push({
            time: startTime,
            readyQueue: allReadyIds(),
            runningProcessId: currentId,
            completedProcessIds: [...completedProcessIds],
        });

        // Update remaining burst
        remainingBurst.set(currentId, burstLeft - runTime);
        currentTime = endTime;

        // Add arrivals during execution window (startTime, endTime]
        addArrivals(endTime);

        // Log the scheduling decision
        logs.push({
            time: startTime,
            message: `${QUEUE_NAMES[qLevel]} → ${currentId} runs for ${runTime} units (${QUEUE_ALGOS[qLevel]})`,
            type: 'info',
        });

        if (remainingBurst.get(currentId)! > 0) {
            // Process not finished — re-add to its queue
            queues[qLevel].push(currentId);

            // Check if preempted by higher queue
            const newHighest = highestQueue();
            if (newHighest !== null && newHighest < qLevel) {
                logs.push({
                    time: endTime,
                    message: `⚡ ${QUEUE_NAMES[newHighest]} preempts ${QUEUE_NAMES[qLevel]} — ${currentId} re-queued`,
                    type: 'warning',
                });
            } else if (qLevel <= 2) {
                logs.push({
                    time: endTime,
                    message: `${currentId} quantum expired in ${QUEUE_NAMES[qLevel]}, re-queued`,
                    type: 'info',
                });
            }
        } else {
            // Process completed
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
                responseTime,
            });

            logs.push({
                time: endTime,
                message: `✅ ${currentId} completed in ${QUEUE_NAMES[qLevel]}`,
                type: 'success',
            });
        }

        // Snapshot after execution
        snapshots.push({
            time: currentTime,
            readyQueue: allReadyIds(),
            runningProcessId: null,
            completedProcessIds: [...completedProcessIds],
        });
    }

    return { ganttChart, metrics, snapshots, logs };
};
