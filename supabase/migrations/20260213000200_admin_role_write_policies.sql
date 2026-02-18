-- ============================================================
-- RBAC hardening: admin-only write policies
-- ============================================================

-- Tools
DROP POLICY IF EXISTS "Admins can manage all tools" ON tools;

CREATE POLICY "Admin profiles can view all tools"
  ON tools FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admins can insert tools"
  ON tools FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can update tools"
  ON tools FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete tools"
  ON tools FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

-- Categories
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

-- Submissions
DROP POLICY IF EXISTS "Admins can manage submissions" ON submissions;

CREATE POLICY "Admin profiles can view submissions"
  ON submissions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admins can update submissions"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete submissions"
  ON submissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

-- Tags
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;

CREATE POLICY "Admins can insert tags"
  ON tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can update tags"
  ON tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete tags"
  ON tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

-- Tool tags
DROP POLICY IF EXISTS "Admins can manage tool_tags" ON tool_tags;

CREATE POLICY "Admins can insert tool_tags"
  ON tool_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can update tool_tags"
  ON tool_tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete tool_tags"
  ON tool_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

-- Tool alternatives
DROP POLICY IF EXISTS "Admins can manage tool_alternatives" ON tool_alternatives;

CREATE POLICY "Admins can insert tool_alternatives"
  ON tool_alternatives FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can update tool_alternatives"
  ON tool_alternatives FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete tool_alternatives"
  ON tool_alternatives FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

-- Admin profiles
DROP POLICY IF EXISTS "Admins can manage admin_profiles" ON admin_profiles;

CREATE POLICY "Admins can insert admin_profiles"
  ON admin_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin_profiles"
  ON admin_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete admin_profiles"
  ON admin_profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role = 'admin'
    )
  );
