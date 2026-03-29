-- Learning modules and lessons
-- Run after auth and profiles

CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_modules_slug ON learning_modules(slug);
CREATE INDEX IF NOT EXISTS idx_learning_modules_sort ON learning_modules(sort_order);

DROP TRIGGER IF EXISTS update_learning_modules_updated_at ON learning_modules;
CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON learning_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT,
  body TEXT,
  has_video BOOLEAN NOT NULL DEFAULT false,
  video_url TEXT,
  video_duration TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_lessons_module_id ON learning_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_learning_lessons_sort ON learning_lessons(module_id, sort_order);

DROP TRIGGER IF EXISTS update_learning_lessons_updated_at ON learning_lessons;
CREATE TRIGGER update_learning_lessons_updated_at
  BEFORE UPDATE ON learning_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Learning modules are readable by everyone" ON learning_modules;
CREATE POLICY "Learning modules are readable by everyone"
  ON learning_modules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage learning modules" ON learning_modules;
CREATE POLICY "Only admins can manage learning modules"
  ON learning_modules FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE learning_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Learning lessons are readable by everyone" ON learning_lessons;
CREATE POLICY "Learning lessons are readable by everyone"
  ON learning_lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage learning lessons" ON learning_lessons;
CREATE POLICY "Only admins can manage learning lessons"
  ON learning_lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT ON learning_modules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_modules TO authenticated;
GRANT SELECT ON learning_lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_lessons TO authenticated;
