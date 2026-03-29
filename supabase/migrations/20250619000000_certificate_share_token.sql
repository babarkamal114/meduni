-- Shareable public link for certificates (e.g. LinkedIn)

ALTER TABLE user_module_certifications
  ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_module_certifications_share_token
  ON user_module_certifications(share_token)
  WHERE share_token IS NOT NULL;

-- Users can update their own certification rows (to set share_token)
DROP POLICY IF EXISTS "Users can update own certifications" ON user_module_certifications;
CREATE POLICY "Users can update own certifications"
  ON user_module_certifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT UPDATE ON user_module_certifications TO authenticated;

-- Public read by token: function runs with definer rights so anon can call it
CREATE OR REPLACE FUNCTION get_certificate_by_share_token(p_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  IF p_token IS NULL OR p_token = '' THEN
    RETURN NULL;
  END IF;
  SELECT json_build_object(
    'userName', COALESCE(p.full_name, 'Learner'),
    'moduleTitle', m.title,
    'moduleSlug', m.slug,
    'certifiedAt', c.certified_at
  ) INTO result
  FROM user_module_certifications c
  JOIN profiles p ON p.id = c.user_id
  JOIN learning_modules m ON m.id = c.module_id
  WHERE c.share_token = p_token
  LIMIT 1;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_certificate_by_share_token(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_certificate_by_share_token(TEXT) TO authenticated;
