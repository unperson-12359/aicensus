-- ============================================================
-- Add 3 new categories for tool taxonomy expansion
-- ============================================================

INSERT INTO categories (name, slug, description, icon, display_order)
VALUES
  (
    'Agents & Automation',
    'agents-automation',
    'Agent frameworks, workflow orchestration, and AI-driven automation platforms for multi-step task execution.',
    'bot',
    12
  ),
  (
    'Models & Infrastructure',
    'models-infrastructure',
    'LLM APIs, model hosting, inference platforms, and local runtimes for running and deploying AI models.',
    'server',
    13
  ),
  (
    'Music & Audio',
    'music-audio',
    'AI tools for music generation, composition, and sound design — distinct from video and speech audio.',
    'music',
    14
  )
ON CONFLICT (slug) DO NOTHING;
