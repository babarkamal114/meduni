-- Webinars and webinar registrations
-- Run in Supabase SQL Editor or via supabase db push

-- ============================================
-- 1. webinars table
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
-- 2. webinar_registrations table
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
-- 3. RLS for webinars
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
-- 4. RLS for webinar_registrations
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
