-- Dashboard notifications: broadcast when admin adds webinar, module, lesson, content, case study.
-- Users see weekly notifications; clicking Open marks as read.

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('webinar', 'module', 'lesson', 'content', 'case_study')),
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS notification_reads (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, notification_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON notification_reads(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;

-- Everyone can read notifications (broadcast)
DROP POLICY IF EXISTS "Notifications are readable by everyone" ON notifications;
CREATE POLICY "Notifications are readable by everyone"
  ON notifications FOR SELECT
  USING (true);

-- Only service role / admin can insert (done via server with service role)
DROP POLICY IF EXISTS "Only admins can insert notifications" ON notifications;
CREATE POLICY "Only admins can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can read their own read state
DROP POLICY IF EXISTS "Users can view own notification reads" ON notification_reads;
CREATE POLICY "Users can view own notification reads"
  ON notification_reads FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notification read" ON notification_reads;
CREATE POLICY "Users can insert own notification read"
  ON notification_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON notifications TO anon, authenticated;
GRANT INSERT ON notifications TO authenticated;
GRANT SELECT, INSERT ON notification_reads TO authenticated;

-- Realtime: allow authenticated users to listen for new notifications (optional; may fail if publication not used)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN OTHERS THEN
  NULL; -- ignore if publication does not exist or table already added
END $$;
