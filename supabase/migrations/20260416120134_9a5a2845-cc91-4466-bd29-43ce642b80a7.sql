
-- Create admin role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles: only admins can see roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies on members
DROP POLICY "Authenticated users can view members" ON public.members;
DROP POLICY "Authenticated users can insert members" ON public.members;
DROP POLICY "Authenticated users can update members" ON public.members;
DROP POLICY "Authenticated users can delete members" ON public.members;

-- Admin-only policies on members
CREATE POLICY "Admins can view members" ON public.members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update members" ON public.members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete members" ON public.members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive content management policy
DROP POLICY "Authenticated users can manage content" ON public.content;

-- Admin-only content management
CREATE POLICY "Admins can manage content" ON public.content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
