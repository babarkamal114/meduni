-- Fix profiles SELECT so own row is always readable (no role-dependent read).
-- Ensures users with role = 'admin' can read their own profile including role.

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
