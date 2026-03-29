-- User lesson completions for progress tracking

CREATE TABLE IF NOT EXISTS user_lesson_completions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lesson_completions_user_id ON user_lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_completions_lesson_id ON user_lesson_completions(lesson_id);

ALTER TABLE user_lesson_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own completions" ON user_lesson_completions;
CREATE POLICY "Users can view own completions"
  ON user_lesson_completions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own completions" ON user_lesson_completions;
CREATE POLICY "Users can insert own completions"
  ON user_lesson_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all completions" ON user_lesson_completions;
CREATE POLICY "Admins can view all completions"
  ON user_lesson_completions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT, INSERT ON user_lesson_completions TO authenticated;
