import { Process, AlgorithmType } from './types';

export interface AIProcessResponse {
    algorithm: AlgorithmType;
    concept: string;
    processes: Process[];
}

export async function generateAIProcesses(scenario: string): Promise<AIProcessResponse> {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
    });
    console.log("res : ", res)
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate processes.');
    }

    const data = await res.json();

    // Assign random colors and queue levels if missing
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    data.processes = data.processes.map((p: {
        id?: string;
        arrivalTime?: string | number;
        burstTime?: string | number;
        priority?: string | number;
        color?: string;
        queueLevel?: number;
    }, index: number) => ({
        id: p.id || `P${index + 1}`,
        arrivalTime: Number(p.arrivalTime) || 0,
        burstTime: Number(p.burstTime) || 1,
        priority: Number(p.priority) || 1,
        color: p.color || colors[index % colors.length],
        queueLevel: p.queueLevel || 3,
    }));

    return data as AIProcessResponse;
}
