-- Persistent contact-form rate limiting. Public users never touch this table
-- directly; /api/contact writes it with the service role.
CREATE TABLE IF NOT EXISTS contact_rate_limits (
  key_hash text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage contact rate limits"
  ON contact_rate_limits;

CREATE POLICY "Service role can manage contact rate limits"
  ON contact_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS contact_rate_limits_updated_at_idx
  ON contact_rate_limits (updated_at);
