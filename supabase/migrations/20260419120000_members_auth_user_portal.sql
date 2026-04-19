-- Link gym members to Supabase auth users for the member portal (read-only self access).
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS members_auth_user_id_unique
  ON public.members(auth_user_id)
  WHERE auth_user_id IS NOT NULL;

-- Authenticated users can read their own member row (in addition to admin policies).
CREATE POLICY "Members can view own linked record"
  ON public.members
  FOR SELECT
  TO authenticated
  USING (auth_user_id IS NOT NULL AND auth_user_id = auth.uid());
