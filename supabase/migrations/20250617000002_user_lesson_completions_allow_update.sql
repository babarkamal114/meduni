-- Allow users to update their own lesson completions (required for upsert when row exists)

DROP POLICY IF EXISTS "Users can update own completions" ON user_lesson_completions;
CREATE POLICY "Users can update own completions"
  ON user_lesson_completions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT UPDATE ON user_lesson_completions TO authenticated;
