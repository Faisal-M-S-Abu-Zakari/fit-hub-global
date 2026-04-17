-- Ensure landing page can read public content and exercise items.
-- This keeps admin management policies unchanged.

ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active content" ON public.content;
CREATE POLICY "Anyone can view active content"
ON public.content
FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view exercise items" ON public.exercise_items;
CREATE POLICY "Anyone can view exercise items"
ON public.exercise_items
FOR SELECT
TO anon, authenticated
USING (true);
