/**
 * URL phishing/spam detection.
 *
 * Layer 1: Fast heuristic rules (zero latency)
 * Layer 2: Ollama LLM check (if available, adds ~1-2s)
 *
 * Returns { safe: boolean, reason: string }
 */

import { generate, isAvailable } from "./groq";

export interface PhishingResult {
    safe: boolean;
    reason: string;
}

// ── Known safe TLDs + domains to skip the expensive check ───────────────────
const TRUSTED_DOMAINS = new Set([
    "google.com", "youtube.com", "github.com", "twitter.com", "x.com",
    "instagram.com", "tiktok.com", "facebook.com", "linkedin.com",
    "microsoft.com", "apple.com", "amazon.com", "shopee.co.id",
    "tokopedia.com", "gojek.com", "grab.com", "bukalapak.com",
]);

// ── Patterns that are almost always phishing ────────────────────────────────
const HEURISTIC_RULES: Array<{ test: (url: URL) => boolean; reason: string }> = [
    {
        // Bare IP address as hostname
        test: (u) => /^(\d{1,3}\.){3}\d{1,3}$/.test(u.hostname),
        reason: "URL uses a raw IP address instead of a domain name.",
    },
    {
        // Excessive subdomains (>= 5 labels)
        test: (u) => u.hostname.split(".").length >= 5,
        reason: "URL has an unusually large number of subdomains.",
    },
    {
        // Non-standard port (keep 80, 443, 3000, 4321 as safe for dev)
        test: (u) =>
            u.port !== "" &&
            !["80", "443", "3000", "4321", "8080", "8000"].includes(u.port),
        reason: "URL uses an unusual port number.",
    },
    {
        // URL contains another URL (redirector trick)
        test: (u) =>
            /https?:\/\/.+https?:\/\//.test(u.href),
        reason: "URL appears to redirect through another URL.",
    },
    {
        // Punycode internationalized domain (common in homograph attacks)
        test: (u) => u.hostname.includes("xn--"),
        reason: "URL uses a punycode (internationalized) domain, often used in phishing.",
    },
    {
        // Brand-impersonation pattern: "paypal-login", "amazon-secure" etc.
        test: (u) => {
            const brands = ["paypal", "amazon", "apple", "google", "microsoft", "facebook", "instagram", "bank", "secure", "login", "verify", "account"];
            const hostname = u.hostname.toLowerCase();
            return brands.filter((b) => hostname.includes(b)).length >= 2;
        },
        reason: "URL hostname contains multiple brand/security keywords, a common phishing indicator.",
    },
    {
        // Extremely long hostname (>60 chars)
        test: (u) => u.hostname.length > 60,
        reason: "URL hostname is unusually long.",
    },
];

function getRootDomain(hostname: string): string {
    const parts = hostname.split(".");
    return parts.slice(-2).join(".");
}

function runHeuristics(url: URL): PhishingResult | null {
    // Trust-list fast exit
    if (TRUSTED_DOMAINS.has(getRootDomain(url.hostname))) {
        return { safe: true, reason: "trusted domain" };
    }

    for (const rule of HEURISTIC_RULES) {
        if (rule.test(url)) {
            return { safe: false, reason: rule.reason };
        }
    }

    return null; // inconclusive — let Ollama decide
}

async function runAICheck(rawUrl: string): Promise<PhishingResult> {
    const prompt = `You are a URL safety classifier. Analyze this URL and determine if it is likely a phishing, spam, or malicious site.

URL: ${rawUrl}

Rules:
- Reply with exactly one line: "SAFE" or "UNSAFE: <short reason>"
- SAFE means the URL looks legitimate
- UNSAFE means it shows signs of phishing, spam, or malware distribution

Your response:`;

    try {
        let resultText = await generate(prompt, "llama-3.3-70b-versatile", { maxOutputTokens: 100 });
        resultText = resultText.trim();
        const up = resultText.toUpperCase();
        if (up.startsWith("UNSAFE")) {
            const reason = resultText.includes(":")
                ? resultText.split(":").slice(1).join(":").trim()
                : "Flagged as potentially unsafe by AI analysis.";
            return { safe: false, reason };
        }
        return { safe: true, reason: "AI analysis found no phishing indicators." };
    } catch (err) {
        // AI unavailable — fail open (let the URL through)
        console.warn("[phishing] AI check skipped:", (err as Error).message);
        return { safe: true, reason: "AI check skipped (Groq unavailable)." };
    }
}

/**
 * Main entry point.
 * @param rawUrl - The URL string to check (must be http/https)
 * @param useAI  - Whether to run the Ollama check (default: true)
 */
export async function checkUrl(
    rawUrl: string,
    useAI = true
): Promise<PhishingResult> {
    // Security check disabled
    return { safe: true, reason: "Security check disabled" };
}
