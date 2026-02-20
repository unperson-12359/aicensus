-- ============================================================
-- FIX: Strengthen admin RLS policies to check role = 'admin'
-- Previously these only checked existence in admin_profiles,
-- allowing editors/viewers to bypass role restrictions.
-- ============================================================

-- ---------- user_profiles ----------

DROP POLICY IF EXISTS "Admins can manage user_profiles" ON user_profiles;
CREATE POLICY "Admins can manage user_profiles"
  ON user_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin'
    )
  );

-- ---------- portfolio_projects ----------

DROP POLICY IF EXISTS "Admins can manage portfolio_projects" ON portfolio_projects;
CREATE POLICY "Admins can manage portfolio_projects"
  ON portfolio_projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin'
    )
  );

-- ---------- project_messages ----------

DROP POLICY IF EXISTS "Admins can manage project_messages" ON project_messages;
CREATE POLICY "Admins can manage project_messages"
  ON project_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin'
    )
  );

-- ---------- featured_subscriptions ----------

DROP POLICY IF EXISTS "Admins can view featured subscriptions" ON featured_subscriptions;
CREATE POLICY "Admins can view featured subscriptions"
  ON featured_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage featured subscriptions" ON featured_subscriptions;
CREATE POLICY "Admins can manage featured subscriptions"
  ON featured_subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin'
    )
  );

-- ---------- Fix SECURITY DEFINER functions ----------

CREATE OR REPLACE FUNCTION approve_project(
  p_project_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_profiles ap
    WHERE ap.id = auth.uid() AND ap.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admin users can approve projects';
  END IF;

  UPDATE portfolio_projects
  SET
    status = 'published',
    admin_notes = NULLIF(TRIM(p_notes), ''),
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    published_at = COALESCE(published_at, now())
  WHERE id = p_project_id
    AND status = 'pending_review';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found or not pending review';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION reject_project(
  p_project_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_profiles ap
    WHERE ap.id = auth.uid() AND ap.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admin users can reject projects';
  END IF;

  UPDATE portfolio_projects
  SET
    status = 'rejected',
    admin_notes = NULLIF(TRIM(p_notes), ''),
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = p_project_id
    AND status = 'pending_review';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found or not pending review';
  END IF;
END;
$$;
