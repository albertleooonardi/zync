-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Creates the email_verifications table used for custom OTP verification.

CREATE TABLE IF NOT EXISTS public.email_verifications (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    email       TEXT        NOT NULL,
    code        TEXT        NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
    used        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup by email
CREATE INDEX IF NOT EXISTS idx_email_verifications_email
    ON public.email_verifications (email);

-- Enable RLS so anon/browser clients can't read or write codes directly
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Block all direct client access — only the server's service_role key can access this table
CREATE POLICY "service_role only"
    ON public.email_verifications
    USING (false);
