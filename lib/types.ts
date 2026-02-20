
export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // Lower value usually means higher priority, will clarify in usage
  color: string;
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

export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'RR' | 'SRJF';

export interface AlgorithmOptions {
  timeQuantum?: number; // For RR
}
