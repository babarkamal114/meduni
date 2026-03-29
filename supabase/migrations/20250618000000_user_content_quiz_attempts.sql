-- Content quiz attempts (weekly materials quizzes; distinct from module lesson quizzes)

CREATE TABLE IF NOT EXISTS user_content_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES learning_content_items(id) ON DELETE CASCADE,
  score_percent INT NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_content_quiz_attempts_user_id ON user_content_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_quiz_attempts_content_item_id ON user_content_quiz_attempts(content_item_id);

ALTER TABLE user_content_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own content quiz attempts" ON user_content_quiz_attempts;
CREATE POLICY "Users can view own content quiz attempts"
  ON user_content_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own content quiz attempts" ON user_content_quiz_attempts;
CREATE POLICY "Users can insert own content quiz attempts"
  ON user_content_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON user_content_quiz_attempts TO authenticated;
