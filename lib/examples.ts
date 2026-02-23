import { Process, AlgorithmType } from "./types";

export interface AlgorithmExample {
    algorithm: AlgorithmType;
    title: string;
    description: string; // What this example demonstrates
    processes: Process[];
    recommendedTimeQuantum?: number;
    recommendedMLQConfig?: {
        q1TimeQuantum: number;
        q2TimeQuantum: number;
        feedbackEnabled: boolean;
        agingEnabled: boolean;
        agingThreshold: number;
    };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const ALGORITHM_EXAMPLES: Record<AlgorithmType, AlgorithmExample> = {
    FCFS: {
        algorithm: 'FCFS',
        title: 'FCFS — Convoy Effect',
        description:
            'P1 (long burst) arrives first, so P2 & P3 (short bursts) must wait behind it. This "convoy effect" leads to high average waiting time — the key weakness of FCFS.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 1, color: COLORS[0] },
            { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1, color: COLORS[1] },
            { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 1, color: COLORS[2] },
            { id: 'P4', arrivalTime: 3, burstTime: 3, priority: 1, color: COLORS[3] },
        ],
    },
    SJF: {
        algorithm: 'SJF',
        title: 'SJF — Optimal Waiting Time',
        description:
            'All processes arrive at t=0. SJF picks the shortest job first (P3 → P2 → P4 → P1), giving the lowest possible average waiting time for non-preemptive scheduling.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 7, priority: 1, color: COLORS[0] },
            { id: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, color: COLORS[1] },
            { id: 'P3', arrivalTime: 0, burstTime: 1, priority: 1, color: COLORS[2] },
            { id: 'P4', arrivalTime: 0, burstTime: 4, priority: 1, color: COLORS[3] },
        ],
    },
    SRTF: {
        algorithm: 'SRTF',
        title: 'SRTF — Preemptive Shortest Job',
        description:
            'P1 starts running, but when P2 arrives at t=2 with a shorter remaining time, it preempts P1. This shows how SRTF dynamically switches to the shortest remaining job.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 1, color: COLORS[0] },
            { id: 'P2', arrivalTime: 2, burstTime: 2, priority: 1, color: COLORS[1] },
            { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 1, color: COLORS[2] },
            { id: 'P4', arrivalTime: 5, burstTime: 3, priority: 1, color: COLORS[3] },
        ],
    },
    Priority: {
        algorithm: 'Priority',
        title: 'Priority — High Priority First',
        description:
            'P3 has the highest priority (1) despite arriving last. Once available, it runs before lower-priority processes. Lower number = higher priority.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 3, color: COLORS[0] },
            { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 2, color: COLORS[1] },
            { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 1, color: COLORS[2] },
            { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 4, color: COLORS[3] },
        ],
    },
    RR: {
        algorithm: 'RR',
        title: 'RR — Fair Time Sharing',
        description:
            'With quantum=3, each process runs a max of 3 units before switching. This gives every process fair CPU access and good response time, at the cost of context-switch overhead.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 10, priority: 1, color: COLORS[0] },
            { id: 'P2', arrivalTime: 0, burstTime: 4, priority: 1, color: COLORS[1] },
            { id: 'P3', arrivalTime: 0, burstTime: 6, priority: 1, color: COLORS[2] },
            { id: 'P4', arrivalTime: 0, burstTime: 2, priority: 1, color: COLORS[3] },
        ],
        recommendedTimeQuantum: 3,
    },
    SRJF: {
        algorithm: 'SRJF',
        title: 'SRJF — Same as SRTF',
        description:
            'Shortest Remaining Job First is another name for SRTF. Shorter remaining jobs preempt longer ones for optimal turnaround.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 1, color: COLORS[0] },
            { id: 'P2', arrivalTime: 2, burstTime: 2, priority: 1, color: COLORS[1] },
            { id: 'P3', arrivalTime: 3, burstTime: 1, priority: 1, color: COLORS[2] },
        ],
    },
    MLQ: {
        algorithm: 'MLQ',
        title: 'MLQ — Static Multi-Level Queue',
        description:
            'Three fixed-priority queues: system (Q1), interactive (Q2), batch (Q3). No feedback or aging — lower queues can suffer from starvation if higher-priority queues are busy.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 1, color: COLORS[0], queueLevel: 1 },
            { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 2, color: COLORS[1], queueLevel: 2 },
            { id: 'P3', arrivalTime: 2, burstTime: 5, priority: 3, color: COLORS[2], queueLevel: 3 },
            { id: 'P4', arrivalTime: 4, burstTime: 4, priority: 4, color: COLORS[3], queueLevel: 3 },
        ] as Process[],
        recommendedMLQConfig: {
            q1TimeQuantum: 2,
            q2TimeQuantum: 4,
            feedbackEnabled: false,
            agingEnabled: false,
            agingThreshold: 9999,
        },
    },
    MLFQ: {
        algorithm: 'MLFQ',
        title: 'MLFQ — Feedback & Aging Demo',
        description:
            'macOS-style multi-level feedback queue. P1 (Q1 system) demotes to Q2 after using its quantum. P4 (Q3 batch) waits, but aging promotes it after the threshold. This shows both feedback demotion and starvation prevention.',
        processes: [
            { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 1, color: COLORS[0], queueLevel: 1 },
            { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 2, color: COLORS[1], queueLevel: 2 },
            { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 3, color: COLORS[2], queueLevel: 2 },
            { id: 'P4', arrivalTime: 0, burstTime: 4, priority: 4, color: COLORS[3], queueLevel: 3 },
            { id: 'P5', arrivalTime: 3, burstTime: 1, priority: 1, color: COLORS[4], queueLevel: 1 },
        ] as Process[],
        recommendedMLQConfig: {
            q1TimeQuantum: 2,
            q2TimeQuantum: 4,
            feedbackEnabled: true,
            agingEnabled: true,
            agingThreshold: 8,
        },
    },
};
