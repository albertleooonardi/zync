-- Run in Supabase Dashboard → SQL Editor → New Query
-- Adds a 'device' column to clicks for easier device-type queries.
-- Run AFTER create_links_and_clicks.sql

ALTER TABLE public.clicks
    ADD COLUMN IF NOT EXISTS device TEXT DEFAULT 'unknown';
