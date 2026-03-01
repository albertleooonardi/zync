-- Add a click_count integer column to the links table, maintained by a trigger.
-- This avoids expensive GROUP BY queries on the clicks table for every dashboard load.

-- 1. Add the column (default 0)
ALTER TABLE public.links
    ADD COLUMN IF NOT EXISTS click_count INTEGER NOT NULL DEFAULT 0;

-- 2. Back-fill from existing clicks data
UPDATE public.links l
SET    click_count = (
    SELECT COUNT(*) FROM public.clicks c WHERE c.link_id = l.id
);

-- 3. Trigger function — increments/decrements the counter
CREATE OR REPLACE FUNCTION public.update_link_click_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.links SET click_count = click_count + 1 WHERE id = NEW.link_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.links SET click_count = GREATEST(click_count - 1, 0) WHERE id = OLD.link_id;
    END IF;
    RETURN NULL;
END;
$$;

-- 4. Attach the trigger to the clicks table
DROP TRIGGER IF EXISTS trg_click_count ON public.clicks;
CREATE TRIGGER trg_click_count
AFTER INSERT OR DELETE ON public.clicks
FOR EACH ROW EXECUTE FUNCTION public.update_link_click_count();
