-- Migrate profiles.role from student/admin to member/admin
-- Backfill existing rows
UPDATE profiles SET role = 'member' WHERE role = 'student';

-- Drop existing check constraint (Postgres names it profiles_role_check)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new check and default
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('member', 'admin'));
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'member';
