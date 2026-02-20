-- ============================================================
-- DEMO PROFILE: Fully filled-out showcase profile
-- ============================================================
--
-- BEFORE RUNNING THIS MIGRATION:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" and create a user with:
--    Email: demo@aicensus.xyz (or whatever you prefer)
--    Password: (something you'll remember)
-- 3. Copy the user's UUID from the dashboard
-- 4. Replace 'REPLACE_WITH_AUTH_USER_UUID' below with that UUID
-- 5. Run this SQL in the Supabase SQL Editor
-- ============================================================

-- Set the demo user's UUID here:
DO $$
DECLARE
  demo_uid UUID := '7c842007-e0c7-4147-b38a-d9fafaf56bd0';
BEGIN

-- Insert the demo user profile (fully filled out)
INSERT INTO user_profiles (
  id,
  username,
  display_name,
  bio,
  about_md,
  avatar_url,
  header_image_url,
  github_url,
  twitter_url,
  linkedin_url,
  website_url,
  contact_email,
  is_public
) VALUES (
  demo_uid,
  'demo',
  'AiCensus Demo',
  'This is a demo profile showcasing what a complete AiCensus portfolio looks like. Built entirely with AI tools.',
  E'## About This Demo\n\nThis profile demonstrates the full power of an **AiCensus portfolio**. Every section is filled out so you can see exactly what your profile will look like.\n\n### What You Can Do\n\n- Showcase your AI-built projects with live previews\n- Add your tech stack and the AI tools you used\n- Connect your social links so people can find you\n- Receive messages from visitors through the built-in contact form\n\n### Built With AI\n\nEvery project on this profile was built using AI coding assistants — proving that anyone can ship real products with the right tools.\n\n---\n\n*This is an example profile. [Create your own for free →](/signup)*',
  'https://api.dicebear.com/9.x/glass/svg?seed=AiCensus&backgroundType=gradientLinear&backgroundColor=1e1b4b,312e81',
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=1200&h=400&fit=crop&crop=top',
  'https://github.com/aicensus',
  'https://x.com/aicensus',
  'https://linkedin.com/company/aicensus',
  'https://aicensus.xyz',
  'hello@aicensus.xyz',
  true
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  about_md = EXCLUDED.about_md,
  avatar_url = EXCLUDED.avatar_url,
  header_image_url = EXCLUDED.header_image_url,
  github_url = EXCLUDED.github_url,
  twitter_url = EXCLUDED.twitter_url,
  linkedin_url = EXCLUDED.linkedin_url,
  website_url = EXCLUDED.website_url,
  contact_email = EXCLUDED.contact_email,
  is_public = EXCLUDED.is_public;

-- Insert demo project 1: AI Landing Page Builder
INSERT INTO portfolio_projects (
  id,
  user_id,
  name,
  slug,
  description,
  live_url,
  thumbnail_url,
  screenshots,
  tech_stack,
  ai_tools_used,
  status,
  published_at
) VALUES (
  gen_random_uuid(),
  demo_uid,
  'AI Landing Page Builder',
  'ai-landing-page-builder',
  'A drag-and-drop landing page builder that uses AI to generate copy, suggest layouts, and optimize for conversions. Built in a weekend using Claude and v0.',
  'https://aicensus.xyz',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop'
  ],
  ARRAY['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Vercel'],
  ARRAY['Claude', 'v0', 'Cursor'],
  'published',
  now()
)
ON CONFLICT DO NOTHING;

-- Insert demo project 2: Smart Budget Tracker
INSERT INTO portfolio_projects (
  id,
  user_id,
  name,
  slug,
  description,
  live_url,
  thumbnail_url,
  screenshots,
  tech_stack,
  ai_tools_used,
  status,
  published_at
) VALUES (
  gen_random_uuid(),
  demo_uid,
  'Smart Budget Tracker',
  'smart-budget-tracker',
  'A personal finance dashboard that categorizes expenses using AI, generates spending insights, and predicts future costs. The entire frontend was vibe-coded with Cursor.',
  'https://aicensus.xyz',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'
  ],
  ARRAY['Next.js', 'Supabase', 'Tailwind CSS', 'Chart.js', 'TypeScript'],
  ARRAY['Cursor', 'ChatGPT', 'GitHub Copilot'],
  'published',
  now()
)
ON CONFLICT DO NOTHING;

-- Insert demo project 3: AI Recipe Generator
INSERT INTO portfolio_projects (
  id,
  user_id,
  name,
  slug,
  description,
  live_url,
  thumbnail_url,
  screenshots,
  tech_stack,
  ai_tools_used,
  status,
  published_at
) VALUES (
  gen_random_uuid(),
  demo_uid,
  'AI Recipe Generator',
  'ai-recipe-generator',
  'Take a photo of your fridge contents and get instant recipe suggestions powered by GPT-4 Vision. Includes nutritional info, cooking timers, and step-by-step instructions.',
  'https://aicensus.xyz',
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=450&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop'
  ],
  ARRAY['React', 'Node.js', 'OpenAI API', 'Tailwind CSS', 'Vercel'],
  ARRAY['GPT-4 Vision', 'Claude', 'Windsurf'],
  'published',
  now()
)
ON CONFLICT DO NOTHING;

END $$;
