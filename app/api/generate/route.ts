import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { scenario } = await req.json();

        if (!scenario || typeof scenario !== 'string' || scenario.length < 5) {
            return NextResponse.json({ error: 'Please provide a valid scenario description.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log("apiKey : ", apiKey)
        if (!apiKey) {
            return NextResponse.json({ error: 'AI API key is missing. Please check your environment variables.' }, { status: 500 });
        }

        // Prepare prompt
        const prompt = `You are a CPU Scheduling Process Generator.
Based on the following user scenario: "${scenario}"
Generate a dataset of CPU processes that best demonstrates the concept described in the scenario.

Return exactly and ONLY a JSON object (no markdown, no code blocks) matching the following format:
{
  "algorithm": "FCFS" | "SJF" | "SRTF" | "Priority" | "RR" | "SRJF" | "MLQ",
  "concept": "A brief 2-6 word string describing the scheduling concept being shown",
  "processes": [
    { "id": "P1", "arrivalTime": 0, "burstTime": 5, "priority": 1 }
  ]
}

- Generates 3 to 7 processes.
- Burst time should be between 1 and 20.
- Arrival times should intuitively demonstrate the concept.
- Priority: Lower number means higher priority.
- Do NOT wrap the JSON in markdown code blocks (\`\`\`json). Just return raw JSON.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Gemini API Error:', err);
            console.log('Gemini API Error:', response);

            if (response.status === 429) {
                return NextResponse.json({ error: 'API rate limit exceeded. Please wait a moment and try again.' }, { status: 429 });
            }

            return NextResponse.json({ error: 'Failed to generate processes from AI.' }, { status: 500 });
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("resultText : ", resultText)

        if (!resultText) {
            return NextResponse.json({ error: 'Invalid response from AI model.' }, { status: 500 });
        }

        // Parse the generated text into JSON
        const parsedData = JSON.parse(resultText);

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred during generation.' }, { status: 500 });
    }
}
