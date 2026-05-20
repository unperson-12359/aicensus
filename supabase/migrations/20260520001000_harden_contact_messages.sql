-- Route public contact submissions through /api/contact so the server can
-- validate, rate-limit, and insert with the service role instead of exposing
-- a direct anon insert path.
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Service role can submit contact messages" ON contact_messages;

CREATE POLICY "Service role can submit contact messages"
  ON contact_messages FOR INSERT
  TO service_role
  WITH CHECK (true);
