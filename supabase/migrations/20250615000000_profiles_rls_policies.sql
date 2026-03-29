-- RLS policies for profiles table
-- Run in Supabase SQL Editor if applying manually

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;

-- SELECT: users can read their own profile row only
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- UPDATE: users can update their own profile row only
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT: only the trigger (handle_new_user) can insert; no direct inserts by users
CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (false);

GRANT SELECT, UPDATE ON profiles TO authenticated;
