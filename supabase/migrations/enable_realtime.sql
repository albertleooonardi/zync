-- Enable Realtime for the links and clicks tables
-- This ensures the dashboard and analytics pages update live without a refresh
begin;

-- Create publication if it doesn't exist (Supabase creates this by default)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    
    -- Safely add tables if they aren't already added
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'links' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.links;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'clicks' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.clicks;
    END IF;
END
$$;

commit;
