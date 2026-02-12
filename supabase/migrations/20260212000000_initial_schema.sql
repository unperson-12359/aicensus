-- ============================================================
-- AiCensus Database Schema
-- Phase 1: AI Tools Directory
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE tool_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE pricing_model AS ENUM ('free', 'freemium', 'paid', 'open_source', 'enterprise', 'contact');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ============================================================
-- TOOLS
-- ============================================================

CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  screenshot_url TEXT,
  website_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  pricing_model pricing_model NOT NULL DEFAULT 'freemium',
  pricing_details TEXT,
  use_cases TEXT[] DEFAULT '{}',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  who_its_for TEXT[] DEFAULT '{}',
  key_features TEXT[] DEFAULT '{}',
  editor_rating DECIMAL(2,1) CHECK (editor_rating >= 0 AND editor_rating <= 5),
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  status tool_status DEFAULT 'draft',
  affiliate_url TEXT,
  founded_year INT,
  company_name TEXT,
  headquarters TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_featured ON tools(is_featured) WHERE is_featured = true;
CREATE INDEX idx_tools_verified ON tools(is_verified) WHERE is_verified = true;
CREATE INDEX idx_tools_name_trgm ON tools USING gin(name gin_trgm_ops);

-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tool_tags (
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, tag_id)
);

-- ============================================================
-- TOOL ALTERNATIVES
-- ============================================================

CREATE TABLE tool_alternatives (
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  alternative_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, alternative_id),
  CHECK (tool_id != alternative_id)
);

-- ============================================================
-- SUBMISSIONS
-- ============================================================

CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_website TEXT NOT NULL,
  tool_tagline TEXT,
  tool_description TEXT,
  tool_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tool_pricing_model pricing_model,
  status submission_status DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  approved_tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================================
-- ADMIN PROFILES
-- ============================================================

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY,
  display_name TEXT,
  role user_role DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEARCH FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION search_tools(search_query TEXT)
RETURNS SETOF tools AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM tools
  WHERE status = 'published'
    AND (
      name ILIKE '%' || search_query || '%'
      OR tagline ILIKE '%' || search_query || '%'
      OR description ILIKE '%' || search_query || '%'
    )
  ORDER BY
    CASE WHEN name ILIKE search_query THEN 0
         WHEN name ILIKE search_query || '%' THEN 1
         WHEN name ILIKE '%' || search_query || '%' THEN 2
         ELSE 3
    END,
    is_featured DESC,
    editor_rating DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_alternatives ENABLE ROW LEVEL SECURITY;

-- Public read for published tools
CREATE POLICY "Public can view published tools"
  ON tools FOR SELECT
  USING (status = 'published');

-- Admin full access to tools
CREATE POLICY "Admins can manage all tools"
  ON tools FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Public read for categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- Admin manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Anyone can create submissions
CREATE POLICY "Anyone can submit tools"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Only admins can view/manage submissions
CREATE POLICY "Admins can manage submissions"
  ON submissions FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Public read for tags
CREATE POLICY "Public can view tags"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Public read for tool_tags
CREATE POLICY "Public can view tool_tags"
  ON tool_tags FOR SELECT USING (true);

CREATE POLICY "Admins can manage tool_tags"
  ON tool_tags FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Public read for tool_alternatives
CREATE POLICY "Public can view tool_alternatives"
  ON tool_alternatives FOR SELECT USING (true);

CREATE POLICY "Admins can manage tool_alternatives"
  ON tool_alternatives FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Admin profiles: direct ID check (avoids infinite recursion)
CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage admin_profiles"
  ON admin_profiles FOR ALL
  USING (auth.uid() = id);
