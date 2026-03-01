/**
 * Google Gemini AI client (Google AI Studio).
 *
 * Set GOOGLE_AI_API_KEY in your .env file.
 * Get a free key at: https://aistudio.google.com/app/apikey
 *
 * Default model: gemini-2.0-flash (fast, free tier, generous limits)
 */

const API_KEY = import.meta.env.GOOGLE_AI_API_KEY ?? "";
const DEFAULT_MODEL = import.meta.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Generate a text completion using Gemini.
 * Returns the response text, or throws on error.
 */
export async function generate(
    prompt: string,
    model: string = DEFAULT_MODEL,
    timeoutMs = 15_000
): Promise<string> {
    if (!API_KEY) {
        throw new Error(
            "GOOGLE_AI_API_KEY is not set. Get a free key at https://aistudio.google.com/app/apikey"
        );
    }

    const url = `${BASE_URL}/${model}:generateContent?key=${API_KEY}`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 512,
            },
        }),
        signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const json = await res.json();
    const text: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return text.trim();
}

/**
 * Quick check: returns true if the API key is configured.
 * (We can't ping Gemini without a real request, so we just check the key.)
 */
export function isAvailable(): boolean {
    return Boolean(API_KEY);
}
