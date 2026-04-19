ALTER TABLE public.members ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE;
CREATE INDEX IF NOT EXISTS members_auth_user_id_idx ON public.members(auth_user_id);

-- Allow logged-in users to read their own linked member record
DROP POLICY IF EXISTS "Members can view their own profile" ON public.members;
CREATE POLICY "Members can view their own profile"
ON public.members
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());