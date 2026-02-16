import { Process, SimulationResult, ScheduledBlock, SimulationMetric, SystemSnapshot } from "../types";

export const priority = (processes: Process[]): SimulationResult => {
    // Priority Non-preemptive
    // Assuming LOWER number = HIGHER priority (common in Unix).
    // Or HIGHER number = HIGHER priority?
    // Standard: usually smaller integer = higher priority.
    // We'll stick to: Smaller priority value = Higher Priority.

    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const isCompleted = new Array(n).fill(false);
    const ganttChart: ScheduledBlock[] = [];
    const metrics: SimulationMetric[] = [];
    const snapshots: SystemSnapshot[] = [];

    const procList = [...processes];

    while (completedCount < n) {
        const availableProcesses = procList.filter((p, index) =>
            p.arrivalTime <= currentTime && !isCompleted[index]
        );

        let selectedProcess: Process | null = null;
        let selectedIndex = -1;

        if (availableProcesses.length > 0) {
            // Sort by priority (asc), then arrival time
            availableProcesses.sort((a, b) => {
                if (a.priority !== b.priority) return a.priority - b.priority; // Smaller first
                return a.arrivalTime - b.arrivalTime;
            });
            selectedProcess = availableProcesses[0];
            selectedIndex = procList.findIndex(p => p.id === selectedProcess!.id);
        } else {
            const emergingProcesses = procList.filter((p, index) => !isCompleted[index]);
            if (emergingProcesses.length > 0) {
                const nextArrival = Math.min(...emergingProcesses.map(p => p.arrivalTime));
                currentTime = nextArrival;
                continue;
            } else {
                break;
            }
        }

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
