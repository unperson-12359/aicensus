-- ============================================================
-- AiCensus Phase 2: Portfolio Showcase
-- ============================================================

-- ============================================================
-- NEW ENUM
-- ============================================================

CREATE TYPE project_status AS ENUM ('draft', 'pending_review', 'published', 'rejected');

-- ============================================================
-- USER PROFILES
-- ============================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  about_md TEXT,
  avatar_url TEXT,
  header_image_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  featured_project_id UUID,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT username_format CHECK (
    username ~ '^[a-z0-9][a-z0-9_-]{2,29}$'
  )
);

CREATE UNIQUE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_public ON user_profiles(is_public) WHERE is_public = true;

-- ============================================================
-- PORTFOLIO PROJECTS
-- ============================================================

CREATE TABLE portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  live_url TEXT NOT NULL,
  thumbnail_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  ai_tools_used TEXT[] DEFAULT '{}',
  status project_status DEFAULT 'draft',
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  UNIQUE (user_id, slug)
);

CREATE INDEX idx_portfolio_projects_user ON portfolio_projects(user_id);
CREATE INDEX idx_portfolio_projects_status ON portfolio_projects(status);
CREATE INDEX idx_portfolio_projects_published ON portfolio_projects(status, published_at DESC)
  WHERE status = 'published';

-- Add FK for featured_project_id
ALTER TABLE user_profiles
  ADD CONSTRAINT fk_featured_project
  FOREIGN KEY (featured_project_id)
  REFERENCES portfolio_projects(id)
  ON DELETE SET NULL;

-- ============================================================
-- PROJECT MESSAGES
-- ============================================================

CREATE TABLE project_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES portfolio_projects(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_messages_recipient ON project_messages(recipient_user_id, is_read, created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

-- ---------- user_profiles ----------

CREATE POLICY "Public can view public profiles"
  ON user_profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage user_profiles"
  ON user_profiles FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- ---------- portfolio_projects ----------

CREATE POLICY "Public can view published projects"
  ON portfolio_projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can view own projects"
  ON portfolio_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON portfolio_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON portfolio_projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON portfolio_projects FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage portfolio_projects"
  ON portfolio_projects FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- ---------- project_messages ----------

CREATE POLICY "Anyone can send messages"
  ON project_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Recipients can view own messages"
  ON project_messages FOR SELECT
  USING (auth.uid() = recipient_user_id);

CREATE POLICY "Recipients can update own messages"
  ON project_messages FOR UPDATE
  USING (auth.uid() = recipient_user_id)
  WITH CHECK (auth.uid() = recipient_user_id);

CREATE POLICY "Recipients can delete own messages"
  ON project_messages FOR DELETE
  USING (auth.uid() = recipient_user_id);

CREATE POLICY "Admins can manage project_messages"
  ON project_messages FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- ============================================================
-- ADMIN REVIEW FUNCTIONS
-- ============================================================

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
    SELECT 1 FROM admin_profiles WHERE id = auth.uid()
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
    SELECT 1 FROM admin_profiles WHERE id = auth.uid()
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
