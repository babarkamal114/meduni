-- Add quiz step support to learning_lessons (lesson_type + quiz_questions)
-- Each row is a step: either 'content' (lesson) or 'quiz'

ALTER TABLE learning_lessons
  ADD COLUMN IF NOT EXISTS lesson_type TEXT NOT NULL DEFAULT 'content' CHECK (lesson_type IN ('content', 'quiz')),
  ADD COLUMN IF NOT EXISTS quiz_questions JSONB;

