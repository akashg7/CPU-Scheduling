
export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // Lower value usually means higher priority, will clarify in usage
  color: string;
  queueLevel?: 1 | 2 | 3; // For MLQ: 1=System(highest), 2=Interactive, 3=Batch(lowest)
}

export interface ScheduledBlock {
  processId: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface SimulationMetric {
  processId: string;
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
  responseTime: number;
}

// Snapshot of the system state at a specific time (for visualization)
export interface SystemSnapshot {
  time: number;
  readyQueue: string[]; // IDs of processes in ready queue
  runningProcessId: string | null;
  completedProcessIds: string[];
}

export interface SystemLog {
  time: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error'; // warning for preemption, etc.
}

export interface SimulationResult {
  ganttChart: ScheduledBlock[];
  metrics: SimulationMetric[];
  snapshots: SystemSnapshot[];
  logs: SystemLog[];
}

export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'RR' | 'SRJF' | 'MLQ' | 'MLFQ';

export interface MLQConfig {
  q1TimeQuantum: number; // System queue (RR)
  q2TimeQuantum: number; // Interactive queue (RR)
  // Q3 uses FCFS (no quantum needed)
  feedbackEnabled: boolean; // Demote on quantum expiry (Q1→Q2→Q3)
  agingEnabled: boolean;    // Promote after waiting too long (Q3→Q2→Q1)
  agingThreshold: number;   // Time units before aging promotion
}

export interface AlgorithmOptions {
  timeQuantum?: number; // For RR
  mlqConfig?: MLQConfig; // For MLQ
}
