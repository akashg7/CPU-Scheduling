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
    const feedbackEnabled = options?.mlqConfig?.feedbackEnabled ?? true;
    const agingEnabled = options?.mlqConfig?.agingEnabled ?? true;
    const agingThreshold = options?.mlqConfig?.agingThreshold ?? 8;

    // Assign queue levels (default to Q3 if not set)
    const procs = processes.map(p => ({
        ...p,
        queueLevel: (p.queueLevel ?? 3) as 1 | 2 | 3,
    }));

    // Sort by arrival time
    const sortedAll = [...procs].sort((a, b) => a.arrivalTime - b.arrivalTime);

    const ganttChart: ScheduledBlock[] = [];
    const metrics: SimulationMetric[] = [];
    const snapshots: SystemSnapshot[] = [];
    const logs: SystemLog[] = [];

    // Track remaining burst for each process
    const remainingBurst = new Map<string, number>();
    procs.forEach(p => remainingBurst.set(p.id, p.burstTime));

    // Track first response time
    const firstStartTime = new Map<string, number>();

    // ─── MLFQ state ───
    // Current queue level for each process (mutable — changes via feedback/aging)
    const currentQueueLevel = new Map<string, number>();
    procs.forEach(p => currentQueueLevel.set(p.id, p.queueLevel));

    // Last time each process ran or was promoted (for aging calculation)
    const lastActiveTime = new Map<string, number>();
    procs.forEach(p => lastActiveTime.set(p.id, p.arrivalTime));

    // Per-queue ready queues (FIFO order)
    const queues: Record<number, string[]> = { 1: [], 2: [], 3: [] };

    const completedProcessIds: string[] = [];
    let currentTime = 0;
    let arrivalIndex = 0;

    // Helper: add newly arrived processes to their queues
    const addArrivals = (upToTime: number) => {
        while (arrivalIndex < sortedAll.length && sortedAll[arrivalIndex].arrivalTime <= upToTime) {
            const p = sortedAll[arrivalIndex];
            const qLevel = currentQueueLevel.get(p.id)!;
            queues[qLevel].push(p.id);
            lastActiveTime.set(p.id, p.arrivalTime);
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

    // ─── Aging: promote starved processes ───
    const applyAging = () => {
        if (!agingEnabled) return;

        for (const qLevel of [3, 2] as const) {
            const promoted: string[] = [];
            const remaining: string[] = [];

            for (const pid of queues[qLevel]) {
                const waitTime = currentTime - lastActiveTime.get(pid)!;
                if (waitTime >= agingThreshold) {
                    const newLevel = qLevel - 1;
                    currentQueueLevel.set(pid, newLevel);
                    lastActiveTime.set(pid, currentTime); // reset aging counter
                    queues[newLevel].push(pid);
                    promoted.push(pid);

                    logs.push({
                        time: currentTime,
                        message: `⬆ ${pid} promoted ${QUEUE_NAMES[qLevel]} → ${QUEUE_NAMES[newLevel]} (aged ${waitTime} units)`,
                        type: 'warning',
                    });
                } else {
                    remaining.push(pid);
                }
            }

            queues[qLevel] = remaining;
        }
    };

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
    let safetyCounter = 0;
    const maxIterations = procs.length * 200; // prevent infinite loops

    while (completedProcessIds.length < procs.length && safetyCounter < maxIterations) {
        safetyCounter++;

        // Apply aging before each scheduling decision
        applyAging();

        let qLevel = highestQueue();

        // If all queues empty, jump to next arrival
        if (qLevel === null) {
            if (arrivalIndex < sortedAll.length) {
                currentTime = sortedAll[arrivalIndex].arrivalTime;
                addArrivals(currentTime);
                applyAging();
                qLevel = highestQueue();
                if (qLevel === null) break;
            } else {
                break;
            }
        }

        const currentId = queues[qLevel].shift()!;
        const process = procs.find(p => p.id === currentId)!;
        const burstLeft = remainingBurst.get(currentId)!;

        // Determine run time based on queue algorithm
        let runTime: number;
        let usedFullQuantum = false;

        if (qLevel === 1) {
            runTime = Math.min(burstLeft, q1Quantum);
            usedFullQuantum = burstLeft > q1Quantum;
        } else if (qLevel === 2) {
            runTime = Math.min(burstLeft, q2Quantum);
            usedFullQuantum = burstLeft > q2Quantum;
        } else {
            // Q3: FCFS — runs to completion (but can be preempted by higher queue arrival)
            runTime = burstLeft;
            usedFullQuantum = false;
        }

        // For Q3 (FCFS), check if a higher-priority process arrives mid-execution
        if (qLevel === 3) {
            let preemptTime = currentTime + runTime;
            for (let i = arrivalIndex; i < sortedAll.length; i++) {
                const p = sortedAll[i];
                if (p.arrivalTime > currentTime && p.arrivalTime < preemptTime) {
                    const pLevel = currentQueueLevel.get(p.id) ?? p.queueLevel;
                    if (pLevel === 1 || pLevel === 2) {
                        preemptTime = p.arrivalTime;
                        break;
                    }
                }
            }
            if (preemptTime - currentTime < runTime) {
                runTime = preemptTime - currentTime;
                usedFullQuantum = false; // preempted, not quantum expiry
            }
        }

        // For Q2, check if Q1 process arrives and should preempt
        if (qLevel === 2) {
            let preemptTime = currentTime + runTime;
            for (let i = arrivalIndex; i < sortedAll.length; i++) {
                const p = sortedAll[i];
                if (p.arrivalTime > currentTime && p.arrivalTime < preemptTime) {
                    const pLevel = currentQueueLevel.get(p.id) ?? p.queueLevel;
                    if (pLevel === 1) {
                        preemptTime = p.arrivalTime;
                        break;
                    }
                }
            }
            if (preemptTime - currentTime < runTime) {
                runTime = preemptTime - currentTime;
                usedFullQuantum = false; // preempted, not quantum expiry
            }
        }

        if (runTime <= 0) runTime = 1; // safety

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
        lastActiveTime.set(currentId, currentTime); // reset aging counter

        // Add arrivals during execution window
        addArrivals(endTime);

        // Log the scheduling decision
        logs.push({
            time: startTime,
            message: `${QUEUE_NAMES[qLevel]} → ${currentId} runs for ${runTime} units (${QUEUE_ALGOS[qLevel]})`,
            type: 'info',
        });

        if (remainingBurst.get(currentId)! > 0) {
            // Process not finished — decide where to re-queue
            if (feedbackEnabled && usedFullQuantum && qLevel < 3) {
                // ─── FEEDBACK DEMOTION ───
                const newLevel = qLevel + 1;
                currentQueueLevel.set(currentId, newLevel);
                queues[newLevel].push(currentId);

                logs.push({
                    time: endTime,
                    message: `⬇ ${currentId} demoted ${QUEUE_NAMES[qLevel]} → ${QUEUE_NAMES[newLevel]} (quantum expired)`,
                    type: 'warning',
                });
            } else {
                // Re-add to same queue (preempted or feedback disabled)
                queues[qLevel].push(currentId);

                // Check if preempted by higher queue
                const newHighest = highestQueue();
                if (newHighest !== null && newHighest < qLevel) {
                    logs.push({
                        time: endTime,
                        message: `⚡ ${QUEUE_NAMES[newHighest]} preempts ${QUEUE_NAMES[qLevel]} — ${currentId} re-queued`,
                        type: 'warning',
                    });
                } else if (qLevel <= 2 && !usedFullQuantum) {
                    // Preempted mid-quantum
                    logs.push({
                        time: endTime,
                        message: `${currentId} preempted in ${QUEUE_NAMES[qLevel]}, re-queued (same level)`,
                        type: 'info',
                    });
                } else if (qLevel <= 2) {
                    logs.push({
                        time: endTime,
                        message: `${currentId} quantum expired in ${QUEUE_NAMES[qLevel]}, re-queued`,
                        type: 'info',
                    });
                }
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
