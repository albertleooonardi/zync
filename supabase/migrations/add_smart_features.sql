-- Add og: meta-tag override columns and A/B routing columns to links table
-- These are all nullable — null means "use defaults / feature not enabled"

ALTER TABLE public.links
    -- Meta-tag overrides (for rich social previews)
    ADD COLUMN IF NOT EXISTS og_title       TEXT,
    ADD COLUMN IF NOT EXISTS og_description TEXT,
    ADD COLUMN IF NOT EXISTS og_image       TEXT,

    -- A/B routing
    ADD COLUMN IF NOT EXISTS ab_url_b   TEXT,                   -- second destination URL
    ADD COLUMN IF NOT EXISTS ab_weight  INTEGER DEFAULT 50,     -- % chance that visitor goes to original_url

    -- Time-based routing (JSONB array of rules)
    -- Format: [{ "from": "08:00", "to": "12:00", "tz": "Asia/Jakarta", "url": "..." }]
    ADD COLUMN IF NOT EXISTS time_rules JSONB;
