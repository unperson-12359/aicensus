-- ============================================================
-- Atomic submission review RPCs
-- ============================================================

CREATE OR REPLACE FUNCTION approve_submission(
  p_submission_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_submission submissions%ROWTYPE;
  v_tool_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admin users can approve submissions';
  END IF;

  SELECT *
  INTO v_submission
  FROM submissions
  WHERE id = p_submission_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  IF v_submission.status <> 'pending' THEN
    RAISE EXCEPTION 'Submission has already been reviewed';
  END IF;

  INSERT INTO tools (
    name,
    slug,
    tagline,
    description,
    website_url,
    category_id,
    pricing_model,
    status
  )
  VALUES (
    v_submission.tool_name,
    regexp_replace(
      regexp_replace(lower(v_submission.tool_name), '[^a-z0-9\\s-]', '', 'g'),
      '\\s+',
      '-',
      'g'
    ),
    COALESCE(NULLIF(v_submission.tool_tagline, ''), 'AI Tool'),
    COALESCE(v_submission.tool_description, ''),
    v_submission.tool_website,
    v_submission.tool_category_id,
    COALESCE(v_submission.tool_pricing_model, 'freemium')::pricing_model,
    'draft'
  )
  RETURNING id INTO v_tool_id;

  UPDATE submissions
  SET
    status = 'approved',
    admin_notes = NULLIF(TRIM(p_notes), ''),
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    approved_tool_id = v_tool_id
  WHERE id = p_submission_id;

  RETURN v_tool_id;
END;
$$;

CREATE OR REPLACE FUNCTION reject_submission(
  p_submission_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_status submission_status;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM admin_profiles ap
    WHERE ap.id = auth.uid()
      AND ap.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admin users can reject submissions';
  END IF;

  SELECT status
  INTO v_status
  FROM submissions
  WHERE id = p_submission_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  IF v_status <> 'pending' THEN
    RAISE EXCEPTION 'Submission has already been reviewed';
  END IF;

  UPDATE submissions
  SET
    status = 'rejected',
    admin_notes = NULLIF(TRIM(p_notes), ''),
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = p_submission_id;
END;
$$;
