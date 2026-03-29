-- Learning content items (PDF, quiz, video)

CREATE TABLE IF NOT EXISTS learning_content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('pdf', 'quiz', 'video')),
  title TEXT NOT NULL,
  description TEXT,
  meta TEXT,
  estimated_time TEXT,
  download_url TEXT,
  video_url TEXT,
  quiz_questions JSONB,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_content_items_type ON learning_content_items(type);
CREATE INDEX IF NOT EXISTS idx_learning_content_items_sort ON learning_content_items(sort_order);

DROP TRIGGER IF EXISTS update_learning_content_items_updated_at ON learning_content_items;
CREATE TRIGGER update_learning_content_items_updated_at
  BEFORE UPDATE ON learning_content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE learning_content_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Content items are readable by everyone" ON learning_content_items;
CREATE POLICY "Content items are readable by everyone"
  ON learning_content_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can manage content items" ON learning_content_items;
CREATE POLICY "Only admins can manage content items"
  ON learning_content_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT ON learning_content_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON learning_content_items TO authenticated;
