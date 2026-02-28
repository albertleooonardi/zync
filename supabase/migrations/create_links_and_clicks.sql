-- Run in Supabase Dashboard → SQL Editor → New Query
-- Creates the links and clicks tables for the Zync link shortener dashboard.

-- ─── Links ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.links (
    id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    alias        TEXT        NOT NULL UNIQUE,          -- short code e.g. "my-link"
    original_url TEXT        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links (user_id);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own links
CREATE POLICY "owner select" ON public.links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "owner insert" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owner update" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "owner delete" ON public.links FOR DELETE USING (auth.uid() = user_id);

-- ─── Clicks ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clicks (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id    UUID        NOT NULL REFERENCES public.links (id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    country    TEXT,
    referrer   TEXT,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON public.clicks (link_id);

ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Users can read click data for their own links only
CREATE POLICY "owner read clicks" ON public.clicks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.links
            WHERE links.id = clicks.link_id
              AND links.user_id = auth.uid()
        )
    );

-- Anyone (or your redirect handler) can insert a click — tighten this if needed
CREATE POLICY "anyone insert click" ON public.clicks FOR INSERT WITH CHECK (true);
