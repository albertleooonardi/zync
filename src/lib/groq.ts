import Groq from 'groq-sdk';

const API_KEY = import.meta.env.GROQ_AI_API_KEY ?? "";
const DEFAULT_MODEL = import.meta.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

let groqClient: Groq | null = null;
if (API_KEY) {
    groqClient = new Groq({ apiKey: API_KEY });
}

export function isAvailable(): boolean {
    return Boolean(API_KEY);
}

export async function generate(
    prompt: string,
    model: string = DEFAULT_MODEL,
    config?: Record<string, any>
): Promise<string> {
    if (!groqClient) throw new Error("GROQ_AI_API_KEY is not set.");

    const res = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model,
        temperature: config?.temperature ?? 0.7,
        max_tokens: config?.maxOutputTokens ?? 2048,
        response_format: config?.responseMimeType === "application/json" ? { type: "json_object" } : undefined,
    });

    return res.choices[0]?.message?.content ?? "";
}

export async function generateWithTools(
    messages: any[],
    tools: any[],
    model: string = DEFAULT_MODEL,
    config?: Record<string, any>
): Promise<any> {
    if (!groqClient) throw new Error("GROQ_AI_API_KEY is not set.");

    const res = await groqClient.chat.completions.create({
        messages,
        model,
        temperature: config?.temperature ?? 0.2, // Lower temp for more reliable tool calls
        max_tokens: config?.maxOutputTokens ?? 2048,
        tools: tools.length > 0 ? tools : undefined,
    });

    return res.choices[0]?.message ?? { content: "" };
}
