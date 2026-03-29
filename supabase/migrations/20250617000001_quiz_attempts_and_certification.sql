-- Quiz attempts and module certification

-- User quiz attempts (module quiz steps only; weekly content quizzes stay separate)
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  score_percent INT NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_lesson_id ON user_quiz_attempts(lesson_id);

ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Admins can view all quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT, INSERT ON user_quiz_attempts TO authenticated;

-- Pass threshold per module (default 80%)
ALTER TABLE learning_modules
  ADD COLUMN IF NOT EXISTS pass_threshold_percent INT NOT NULL DEFAULT 80;

-- User module certifications (granted when all steps completed + all quiz steps passed)
CREATE TABLE IF NOT EXISTS user_module_certifications (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  certified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_user_module_certifications_user_id ON user_module_certifications(user_id);

ALTER TABLE user_module_certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own certifications" ON user_module_certifications;
CREATE POLICY "Users can view own certifications"
  ON user_module_certifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own certifications" ON user_module_certifications;
CREATE POLICY "Users can insert own certifications"
  ON user_module_certifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all certifications" ON user_module_certifications;
CREATE POLICY "Admins can view all certifications"
  ON user_module_certifications FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT, INSERT ON user_module_certifications TO authenticated;
