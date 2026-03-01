-- Run in Supabase Dashboard → SQL Editor → New Query
-- Creates tables for custom domains and API keys

-- ─── Custom Domains ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.custom_domains (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    domain     TEXT        NOT NULL,
    verified   BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.custom_domains USING (auth.uid() = user_id);

-- ─── API Keys ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.api_keys (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name       TEXT        NOT NULL DEFAULT 'My Key',
    key_hash   TEXT        NOT NULL,           -- store hashed key, never plaintext
    prefix     TEXT        NOT NULL,           -- e.g. "zync_" first 8 chars for display
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used  TIMESTAMPTZ,
    revoked    BOOLEAN     NOT NULL DEFAULT FALSE
);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner all" ON public.api_keys USING (auth.uid() = user_id);
