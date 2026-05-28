-- Zoom webinar metadata for webinar-level and registrant-level links

ALTER TABLE webinars
  ADD COLUMN IF NOT EXISTS zoom_webinar_id TEXT,
  ADD COLUMN IF NOT EXISTS zoom_host_id TEXT,
  ADD COLUMN IF NOT EXISTS zoom_start_url TEXT;

CREATE INDEX IF NOT EXISTS idx_webinars_zoom_webinar_id ON webinars(zoom_webinar_id);

ALTER TABLE webinar_registrations
  ADD COLUMN IF NOT EXISTS zoom_registrant_id TEXT,
  ADD COLUMN IF NOT EXISTS zoom_join_url TEXT,
  ADD COLUMN IF NOT EXISTS zoom_registered_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar_user
  ON webinar_registrations(webinar_id, user_id);

DROP POLICY IF EXISTS "Users can update own registrations" ON webinar_registrations;
CREATE POLICY "Users can update own registrations"
  ON webinar_registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT UPDATE ON webinar_registrations TO authenticated;
