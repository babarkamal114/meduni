-- =============================================================================
-- MedUni full migration for NEW Supabase project
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- Order: auth + profiles → webinars + webinar_registrations → seed
-- =============================================================================

-- ============================================
-- 1. Database Functions (auth)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. Profiles Table
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "System can insert profiles" ON profiles;
CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (false);

GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;

-- ============================================
-- 3. email_verification_tokens table
-- ============================================

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. webinars table
-- ============================================

CREATE TABLE IF NOT EXISTS webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  expert TEXT,
  discipline TEXT,
  outcomes JSONB DEFAULT '[]'::jsonb,
  duration TEXT,
  price TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('live', 'upcoming', 'recorded')),
  status_label TEXT,
  has_replay BOOLEAN DEFAULT false,
  scheduled_at TIMESTAMPTZ,
  join_url TEXT,
  replay_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webinars_slug ON webinars(slug);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinars_scheduled_at ON webinars(scheduled_at);

DROP TRIGGER IF EXISTS update_webinars_updated_at ON webinars;
CREATE TRIGGER update_webinars_updated_at
  BEFORE UPDATE ON webinars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. webinar_registrations table
-- ============================================

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webinar_id UUID NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, webinar_id)
);

CREATE INDEX IF NOT EXISTS idx_webinar_registrations_user_id ON webinar_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar_id ON webinar_registrations(webinar_id);

-- ============================================
-- 6. RLS for webinars
-- ============================================

ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Webinars are readable by everyone" ON webinars;
CREATE POLICY "Webinars are readable by everyone"
  ON webinars FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can insert webinars" ON webinars;
CREATE POLICY "Only admins can insert webinars"
  ON webinars FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can update webinars" ON webinars;
CREATE POLICY "Only admins can update webinars"
  ON webinars FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can delete webinars" ON webinars;
CREATE POLICY "Only admins can delete webinars"
  ON webinars FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

GRANT SELECT ON webinars TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON webinars TO authenticated;

-- ============================================
-- 7. RLS for webinar_registrations
-- ============================================

ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own registrations" ON webinar_registrations;
CREATE POLICY "Users can view own registrations"
  ON webinar_registrations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can register for webinars" ON webinar_registrations;
CREATE POLICY "Users can register for webinars"
  ON webinar_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON webinar_registrations TO authenticated;

-- ============================================
-- 8. Seed webinars
-- ============================================

INSERT INTO webinars (
  slug,
  title,
  expert,
  discipline,
  outcomes,
  duration,
  price,
  status,
  status_label,
  has_replay,
  scheduled_at
) VALUES
(
  'sudden-death-cardiac-causes',
  'Sudden Death Due to Cardiac Causes',
  'Dr Ahmed, UK-NHS Consultant Cardiologist',
  'Cardiology',
  '["Identify high-risk patients","Recognize arrhythmias","Manage emergencies","Case-based OSCE review"]'::jsonb,
  'TBA',
  'TBA',
  'upcoming',
  'Sat, 2nd May 2026',
  false,
  '2026-05-02T18:00:00.000Z'::timestamptz
),
(
  'inguinal-hernia-assessment-management',
  'Inguinal Hernia: Assessment & Management',
  'Dr Khalid Bashir, ER Senior Consultant',
  'Emergency',
  '["Anatomy and pathophysiology","Complicated vs uncomplicated cases","Surgical and conservative management","OSCE relevance"]'::jsonb,
  'TBA',
  'TBA',
  'upcoming',
  'Sat, 30th May 2026',
  false,
  '2026-05-30T18:00:00.000Z'::timestamptz
)
ON CONFLICT (slug) DO NOTHING;
