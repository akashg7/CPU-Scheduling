import { Process, SimulationResult, ScheduledBlock, SimulationMetric, SystemSnapshot } from "../types";

export const sjf = (processes: Process[]): SimulationResult => {
    // SJF Non-preemptive
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const isCompleted = new Array(n).fill(false);
    const ganttChart: ScheduledBlock[] = [];
    const metrics: SimulationMetric[] = [];
    const snapshots: SystemSnapshot[] = [];

    // Sort initially just to have a stable order for indices, though we access by ID mainly
    // Just keep original or copy
    const procList = [...processes]; // assuming logic handles by finding min burst

    while (completedCount < n) {
        // Find processes that have arrived and not completed
        const availableProcesses = procList.filter((p, index) =>
            p.arrivalTime <= currentTime && !isCompleted[index]
        );

        let selectedProcess: Process | null = null;
        let selectedIndex = -1;

        if (availableProcesses.length > 0) {
            // Pick process with shortest burst time
            // Use map to keep track of original index or just search
            // Let's filter first, then sort
            availableProcesses.sort((a, b) => {
                if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
                return a.arrivalTime - b.arrivalTime; // Tie-breaker: FCFS
            });
            selectedProcess = availableProcesses[0];
            // Find index in original list to mark completed
            selectedIndex = procList.findIndex(p => p.id === selectedProcess!.id);
        } else {
            // No process available, advance time to next arrival
            const emergingProcesses = procList.filter((p, index) => !isCompleted[index]);
            if (emergingProcesses.length > 0) {
                // Find minimum arrival time among remaining
                const nextArrival = Math.min(...emergingProcesses.map(p => p.arrivalTime));
                currentTime = nextArrival;
                continue;
            } else {
                // Should not happen if loop condition holds
                break;
            }
        }

        // Execute selected process
        const startTime = currentTime;
        const endTime = startTime + selectedProcess.burstTime;

        ganttChart.push({
            processId: selectedProcess.id,
            startTime,
            endTime,
            color: selectedProcess.color
        });

        const waitingTime = startTime - selectedProcess.arrivalTime;
        const turnaroundTime = endTime - selectedProcess.arrivalTime;

        metrics.push({
            processId: selectedProcess.id,
            waitingTime,
            turnaroundTime,
            completionTime: endTime,
            responseTime: waitingTime
        });

        // Record snapshot at start
        snapshots.push({
            time: startTime,
            readyQueue: availableProcesses
                .filter(p => p.id !== selectedProcess!.id)
                .map(p => p.id),
            runningProcessId: selectedProcess.id,
            completedProcessIds: procList.filter((_, i) => isCompleted[i]).map(p => p.id)
        });

        isCompleted[selectedIndex] = true;
        completedCount++;
        currentTime = endTime;

        // Record snapshot at end
        snapshots.push({
            time: currentTime,
            readyQueue: procList
                .filter((p, i) => !isCompleted[i] && p.arrivalTime <= currentTime)
                .map(p => p.id),
            runningProcessId: null,
            completedProcessIds: procList.filter((_, i) => isCompleted[i]).map(p => p.id)
        });
    }

    return { ganttChart, metrics, snapshots, logs: [] };
};
