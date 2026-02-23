const fetch = require('node-fetch');
async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: "hi" }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });
    const err = await response.text();
    console.log("Status:", response.status);
    console.log("Body:", err);
}
run();
