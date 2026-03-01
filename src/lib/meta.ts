/**
 * Server-side meta-tag fetcher.
 * Fetches the HTML of a URL and extracts og:/twitter: meta tags.
 * Falls back to <title> and <meta name="description"> if og: tags are absent.
 */

export interface MetaInfo {
    title: string;
    description: string;
    image: string;
    siteName: string;
}

function extractMeta(html: string, url: URL): MetaInfo {
    // Helper: extract content of a meta tag by property or name
    function getMeta(attr: string, value: string): string {
        // <meta property="og:title" content="...">
        const re = new RegExp(
            `<meta[^>]+(?:property|name)=["']${value}["'][^>]+content=["']([^"']+)["']`,
            "i"
        );
        const m = html.match(re);
        if (m) return m[1].trim();

        // alternate attr order: content first
        const re2 = new RegExp(
            `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${value}["']`,
            "i"
        );
        const m2 = html.match(re2);
        return m2 ? m2[1].trim() : "";
    }

    function getTitle(): string {
        const og = getMeta("property", "og:title") || getMeta("name", "twitter:title");
        if (og) return og;
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : url.hostname;
    }

    function getDescription(): string {
        return (
            getMeta("property", "og:description") ||
            getMeta("name", "twitter:description") ||
            getMeta("name", "description") ||
            ""
        );
    }

    function getImage(): string {
        const img =
            getMeta("property", "og:image") ||
            getMeta("name", "twitter:image") ||
            getMeta("name", "twitter:image:src");
        if (!img) return "";
        // Resolve relative URLs
        try {
            return new URL(img, url.origin).href;
        } catch {
            return img;
        }
    }

    function getSiteName(): string {
        return getMeta("property", "og:site_name") || url.hostname;
    }

    return {
        title: getTitle(),
        description: getDescription(),
        image: getImage(),
        siteName: getSiteName(),
    };
}

/**
 * Fetch a URL and return its og: meta info.
 * @param rawUrl - the destination URL (must be http/https)
 * @param timeoutMs - max fetch time (default 8s)
 */
export async function fetchMeta(
    rawUrl: string,
    timeoutMs = 8_000
): Promise<MetaInfo> {
    const url = new URL(rawUrl);

    const res = await fetch(rawUrl, {
        headers: {
            // Pretend to be a normal browser to avoid bot detection
            "User-Agent":
                "Mozilla/5.0 (compatible; Zync/1.0; +https://zync.app)",
            Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "follow",
    });

    if (!res.ok) {
        return {
            title: url.hostname,
            description: "",
            image: "",
            siteName: url.hostname,
        };
    }

    // Only parse if it looks like HTML
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
        return {
            title: url.hostname,
            description: "",
            image: "",
            siteName: url.hostname,
        };
    }

    // Read only the first 64KB — og: tags are always in <head>
    const reader = res.body?.getReader();
    let html = "";
    let bytes = 0;
    const MAX = 64 * 1024;

    if (reader) {
        const decoder = new TextDecoder();
        while (bytes < MAX) {
            const { done, value } = await reader.read();
            if (done) break;
            html += decoder.decode(value, { stream: true });
            bytes += value.byteLength;
            // Stop once we've passed </head>
            if (html.includes("</head>")) break;
        }
        reader.cancel();
    }

    return extractMeta(html, url);
}
