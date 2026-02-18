-- ============================================================
-- FEATURED SUBSCRIPTIONS
-- Tracks Stripe subscriptions for featured tool placements
-- ============================================================

CREATE TABLE featured_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Stripe identifiers
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,

  -- Tool info (stored at checkout time)
  tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
  tool_name TEXT NOT NULL,
  tool_website TEXT NOT NULL,
  tool_tagline TEXT,
  tool_description TEXT,
  tool_pricing_model pricing_model,

  -- Submitter info
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,

  -- Subscription state: pending, active, past_due, cancelled, expired
  status TEXT NOT NULL DEFAULT 'pending',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,

  -- Admin
  admin_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_featured_subs_status ON featured_subscriptions(status);
CREATE INDEX idx_featured_subs_stripe_sub ON featured_subscriptions(stripe_subscription_id);
CREATE INDEX idx_featured_subs_tool ON featured_subscriptions(tool_id);

-- Updated_at trigger
CREATE TRIGGER featured_subscriptions_updated_at
  BEFORE UPDATE ON featured_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE featured_subscriptions ENABLE ROW LEVEL SECURITY;

-- Admins can read all subscriptions
CREATE POLICY "Admins can view featured subscriptions"
  ON featured_subscriptions FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- Admins can manage subscriptions
CREATE POLICY "Admins can manage featured subscriptions"
  ON featured_subscriptions FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_profiles)
  );

-- ============================================================
-- TRIGGER: Sync tools.is_featured based on subscription status
-- Active or cancelled (paid through period) = featured
-- Everything else = not featured
-- ============================================================

CREATE OR REPLACE FUNCTION sync_tool_featured_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tool_id IS NOT NULL THEN
    UPDATE tools
    SET is_featured = (NEW.status IN ('active', 'cancelled'))
    WHERE id = NEW.tool_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_featured_on_subscription_change
  AFTER INSERT OR UPDATE OF status, tool_id ON featured_subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_tool_featured_status();
