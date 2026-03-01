import { Process, SimulationResult, ScheduledBlock, SimulationMetric, SystemSnapshot } from "../types";

export const fcfs = (processes: Process[]): SimulationResult => {
    // Sort by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    // For FCFS, we just process in order of arrival. No preemption.
    const ganttChart: ScheduledBlock[] = [];
    const metrics: SimulationMetric[] = [];
    const snapshots: SystemSnapshot[] = [];

    let currentTime = 0;
    const completedProcessIds: string[] = [];

    // Initial snapshot at t=0
    snapshots.push({
        time: 0,
        readyQueue: sortedProcesses
            .filter(p => p.arrivalTime <= 0)
            .map(p => p.id),
        runningProcessId: null,
        completedProcessIds: []
    });

    for (const process of sortedProcesses) {
        // If process arrives after current time, there's idle time
        if (currentTime < process.arrivalTime) {
            // Idle block? Usually we just advance time or show idle block.
            // We will just advance time.
            // But for snapshot consistency, we might want to record the gap ?
            // We'll just update currentTime.
            currentTime = process.arrivalTime;
        }

        const startTime = currentTime;
        const endTime = startTime + process.burstTime;

        // Add to gantt chart
        ganttChart.push({
            processId: process.id,
            startTime,
            endTime,
            color: process.color,
        });

        // Record metrics
        const waitingTime = startTime - process.arrivalTime;
        const turnaroundTime = endTime - process.arrivalTime;

        metrics.push({
            processId: process.id,
            waitingTime,
            turnaroundTime,
            completionTime: endTime,
            responseTime: waitingTime, // For non-preemptive, response = waiting
        });

        // Generate snapshots for the duration of this process
        // We can add a snapshot at start of execution
        snapshots.push({
            time: startTime,
            readyQueue: sortedProcesses
                .filter(p => p.arrivalTime <= startTime && p.id !== process.id && !completedProcessIds.includes(p.id))
                .map(p => p.id)
                .filter(id => id !== process.id), // Double check
            runningProcessId: process.id,
            completedProcessIds: [...completedProcessIds]
        });

        // Advance time
        currentTime = endTime;
        completedProcessIds.push(process.id);

        // Snapshot at completion (before next decision)
        snapshots.push({
            time: endTime,
            readyQueue: sortedProcesses
                .filter(p => p.arrivalTime <= endTime && !completedProcessIds.includes(p.id))
                .map(p => p.id),
            runningProcessId: null,
            completedProcessIds: [...completedProcessIds]
        });
    }

    return {
        ganttChart,
        metrics,
        snapshots,
        logs: []
    };
};
