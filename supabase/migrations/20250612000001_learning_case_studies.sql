-- Case studies, steps, and choices

CREATE TABLE IF NOT EXISTS learning_case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  outcome_title TEXT,
  outcome_body TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_case_studies_slug ON learning_case_studies(slug);

DROP TRIGGER IF EXISTS update_learning_case_studies_updated_at ON learning_case_studies;
CREATE TRIGGER update_learning_case_studies_updated_at
  BEFORE UPDATE ON learning_case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS learning_case_study_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_study_id UUID NOT NULL REFERENCES learning_case_studies(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  title TEXT NOT NULL,
  narrative TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_case_study_steps_case_id ON learning_case_study_steps(case_study_id);

CREATE TABLE IF NOT EXISTS learning_case_study_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES learning_case_study_steps(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  next_step_key TEXT NOT NULL,
  correct BOOLEAN,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_case_study_choices_step_id ON learning_case_study_choices(step_id);

ALTER TABLE learning_case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Case studies are readable by everyone" ON learning_case_studies;
CREATE POLICY "Case studies are readable by everyone"
  ON learning_case_studies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage case studies" ON learning_case_studies;
CREATE POLICY "Only admins can manage case studies"
  ON learning_case_studies FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE learning_case_study_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Case study steps are readable by everyone" ON learning_case_study_steps;
CREATE POLICY "Case study steps are readable by everyone"
  ON learning_case_study_steps FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage case study steps" ON learning_case_study_steps;
CREATE POLICY "Only admins can manage case study steps"
  ON learning_case_study_steps FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE learning_case_study_choices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Case study choices are readable by everyone" ON learning_case_study_choices;
CREATE POLICY "Case study choices are readable by everyone"
  ON learning_case_study_choices FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage case study choices" ON learning_case_study_choices;
CREATE POLICY "Only admins can manage case study choices"
  ON learning_case_study_choices FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT ON learning_case_studies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_case_studies TO authenticated;
GRANT SELECT ON learning_case_study_steps TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_case_study_steps TO authenticated;
GRANT SELECT ON learning_case_study_choices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_case_study_choices TO authenticated;
