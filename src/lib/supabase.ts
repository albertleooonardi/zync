import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro";

/**
 * Create a Supabase server client scoped to an Astro request/response pair.
 * Reads env vars lazily so missing vars only throw when auth is actually used,
 * not at module import time.
 */
export function createSupabaseServerClient(
    request: Request,
    cookies: AstroCookies
) {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY. " +
            "Copy .env.example to .env and add your Supabase project credentials."
        );
    }

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return parseCookieHeader(request.headers.get("cookie") ?? "")
                    .filter((c): c is { name: string; value: string } => c.value !== undefined);
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    cookies.set(name, value, options as Parameters<AstroCookies["set"]>[2]);
                });
            },
        },
    });
}

/**
 * Create a Supabase admin client using the service_role key.
 * Use ONLY in server-side code — this bypasses Row Level Security.
 */
export function createSupabaseAdminClient() {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        throw new Error(
            "Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
            "Add SUPABASE_SERVICE_ROLE_KEY to your .env file (find it in Supabase Dashboard → Settings → API)."
        );
    }

    return createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
