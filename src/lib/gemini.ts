/**
 * Google Gemini AI client (Google AI Studio).
 *
 * Set GOOGLE_AI_API_KEY in your .env file.
 * Get a free key at: https://aistudio.google.com/app/apikey
 *
 * Default model: gemini-2.0-flash (fast, free tier, generous limits)
 */

const API_KEY = import.meta.env.GOOGLE_AI_API_KEY ?? "";
const DEFAULT_MODEL = import.meta.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Generate a text completion using Gemini.
 * Returns the response text, or throws on error.
 */
export async function generate(
    prompt: string,
    model: string = DEFAULT_MODEL,
    timeoutMs = 15_000,
    config?: Record<string, any>
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
                maxOutputTokens: 2048,
                ...config
            },
        }),
        signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("Gemini API Error details:", err);
        throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const json = await res.json();
    console.log("RAW GEMINI RESPONSE ->", JSON.stringify(json, null, 2));

    const text: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text || json?.candidates?.[0]?.finishReason !== 'STOP') {
        throw new Error("INCOMPLETE_GENERATION|" + JSON.stringify(json));
    }

    return text.trim();
}

/**
 * Gemini Tool / Function declarations
 */
export interface GeminiFunctionDeclaration {
    name: string;
    description: string;
    parameters?: {
        type: "OBJECT";
        properties: Record<string, { type: string; description: string; items?: { type: string } }>;
        required?: string[];
    };
}

export interface GeminiMessage {
    role: "user" | "model";
    parts: Array<{ text?: string; functionCall?: any; functionResponse?: any }>;
}

/**
 * Generate a completion using Gemini, providing tools (Function Calling).
 * Returns the raw JSON response which may contain text or a functionCall.
 */
export async function generateWithTools(
    messages: GeminiMessage[],
    tools: GeminiFunctionDeclaration[],
    model: string = DEFAULT_MODEL,
    timeoutMs = 25_000
): Promise<any> {
    if (!API_KEY) {
        throw new Error("GOOGLE_AI_API_KEY is not set.");
    }

    const url = `${BASE_URL}/${model}:generateContent?key=${API_KEY}`;

    // The Gemini REST API expects { functionDeclarations: [...] } wrapped in a tools array
    const geminiTools = tools.length > 0 ? [{ functionDeclarations: tools }] : undefined;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: messages,
            tools: geminiTools,
            generationConfig: {
                temperature: 0.2, // Lower temp for more reliable tool calls
                maxOutputTokens: 1024,
            },
        }),
        signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const json = await res.json();
    return json?.candidates?.[0]?.content?.parts?.[0] ?? { text: "" };
}

/**
 * Quick check: returns true if the API key is configured.
 * (We can't ping Gemini without a real request, so we just check the key.)
 */
export function isAvailable(): boolean {
    return Boolean(API_KEY);
}
