import {
  Process,
  SimulationResult,
  ScheduledBlock,
  SimulationMetric,
  SystemSnapshot,
  SystemLog,
} from "../types";

/**
 * Shortest Remaining Time First (SRTF) - preemptive SJF.
 * At every moment run the process with the shortest remaining burst time.
 * Preemption occurs when a newly arrived process has strictly less remaining time.
 */
export const srtf = (processes: Process[]): SimulationResult => {
  const ganttChart: ScheduledBlock[] = [];
  const metrics: SimulationMetric[] = [];
  const snapshots: SystemSnapshot[] = [];
  const logs: SystemLog[] = [];

  const procList = [...processes];
  const remainingBurst = new Map<string, number>();
  procList.forEach((p) => remainingBurst.set(p.id, p.burstTime));

  const firstStartTime = new Map<string, number>();
  const completedProcessIds: string[] = [];
  let currentTime = 0;
  const n = processes.length;

  const getReady = (): Process[] =>
    procList.filter(
      (p) =>
        p.arrivalTime <= currentTime && !completedProcessIds.includes(p.id)
    );

  const getRemaining = (id: string) => remainingBurst.get(id) ?? 0;

  const chooseNext = (ready: Process[]): Process | null => {
    if (ready.length === 0) return null;
    return ready.reduce((best, p) => {
      const pRem = getRemaining(p.id);
      const bRem = getRemaining(best.id);
      if (pRem !== bRem) return pRem < bRem ? p : best;
      return p.arrivalTime < best.arrivalTime ? p : best;
    });
  };

  const getNextArrivalAfter = (t: number): number | null => {
    const times = [...new Set(procList.map((p) => p.arrivalTime))].filter(
      (a) => a > t
    );
    return times.length > 0 ? Math.min(...times) : null;
  };

  snapshots.push({
    time: 0,
    readyQueue: getReady().map((p) => p.id),
    runningProcessId: null,
    completedProcessIds: [],
  });

  while (completedProcessIds.length < n) {
    const ready = getReady();

    if (ready.length === 0) {
      const nextArr = getNextArrivalAfter(currentTime);
      if (nextArr === null) break;
      currentTime = nextArr;
      continue;
    }

    const current = chooseNext(ready)!;
    const remaining = getRemaining(current.id);
    if (remaining <= 0) continue;

    if (!firstStartTime.has(current.id)) {
      firstStartTime.set(current.id, currentTime);
    }

    const nextArr = getNextArrivalAfter(currentTime);
    const runDuration =
      nextArr !== null && nextArr < currentTime + remaining
        ? nextArr - currentTime
        : remaining;

    const startTime = currentTime;
    const endTime = startTime + runDuration;

    ganttChart.push({
      processId: current.id,
      startTime,
      endTime,
      color: current.color,
    });

    const newRemaining = remaining - runDuration;
    remainingBurst.set(current.id, newRemaining);

    snapshots.push({
      time: startTime,
      readyQueue: ready.filter((p) => p.id !== current.id).map((p) => p.id),
      runningProcessId: current.id,
      completedProcessIds: [...completedProcessIds],
    });

    currentTime = endTime;

    if (newRemaining <= 0) {
      completedProcessIds.push(current.id);
      const completionTime = endTime;
      const turnaroundTime = completionTime - current.arrivalTime;
      const waitingTime = turnaroundTime - current.burstTime;
      const responseTime =
        (firstStartTime.get(current.id) ?? startTime) - current.arrivalTime;

      metrics.push({
        processId: current.id,
        waitingTime,
        turnaroundTime,
        completionTime,
        responseTime,
      });

      logs.push({
        time: endTime,
        message: `Process ${current.id} completed execution.`,
        type: "success",
      });
    } else {
      logs.push({
        time: endTime,
        message: `Process ${current.id} preempted (shorter job arrived).`,
        type: "warning",
      });
    }

    snapshots.push({
      time: currentTime,
      readyQueue: getReady().map((p) => p.id),
      runningProcessId: null,
      completedProcessIds: [...completedProcessIds],
    });
  }

  return { ganttChart, metrics, snapshots, logs };
};
