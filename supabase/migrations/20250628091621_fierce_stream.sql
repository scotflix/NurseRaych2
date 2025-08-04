/*
  # Fix donation functions and dependencies

  1. Database Functions
    - Drop view first to avoid dependency issues
    - Recreate get_donation_impact_stats() function
    - Create get_campaign_progress() function
    - Recreate donation_statistics view

  2. Performance
    - Add optimized indexes for donation queries
    - Grant proper permissions

  3. Data
    - Ensure default campaign exists
*/

-- Drop view first to avoid dependency issues
DROP VIEW IF EXISTS donation_statistics;

-- Drop existing functions (now safe since view is dropped)
DROP FUNCTION IF EXISTS get_donation_impact_stats();
DROP FUNCTION IF EXISTS get_campaign_progress(uuid);

-- Function to calculate donation impact statistics
CREATE OR REPLACE FUNCTION get_donation_impact_stats()
RETURNS TABLE (
  total_donations_count bigint,
  total_amount_usd decimal,
  lives_touched integer,
  communities_served integer,
  years_of_impact integer,
  last_updated timestamptz
) AS $$
DECLARE
  foundation_year integer := 2025; -- Updated to match the actual foundation year
  lives_per_community integer := 5000;
  base_lives integer := 5000;
  base_communities integer := 20;
  usd_per_life decimal := 10.0;
  total_usd decimal := 0;
  donation_count bigint := 0;
  calculated_lives integer;
  calculated_communities integer;
BEGIN
  -- Get total successful donations count
  SELECT COUNT(*) INTO donation_count
  FROM donations 
  WHERE status = 'succeeded';
  
  -- Calculate total amount in USD (simplified conversion)
  SELECT COALESCE(SUM(
    CASE 
      WHEN currency = 'USD' THEN amount
      WHEN currency = 'KES' THEN amount * 0.0077
      WHEN currency = 'EUR' THEN amount * 1.1
      WHEN currency = 'NGN' THEN amount * 0.0006
      WHEN currency = 'GHS' THEN amount * 0.062
      ELSE amount -- Default to face value for unknown currencies
    END
  ), 0) INTO total_usd
  FROM donations 
  WHERE status = 'succeeded';
  
  -- Calculate lives touched (base + donations impact)
  calculated_lives := base_lives + FLOOR(total_usd / usd_per_life)::integer;
  
  -- Calculate communities served (base + calculated from lives)
  calculated_communities := base_communities + FLOOR(calculated_lives / lives_per_community)::integer;
  
  -- Return the calculated statistics
  RETURN QUERY SELECT
    donation_count,
    total_usd,
    calculated_lives,
    calculated_communities,
    (EXTRACT(YEAR FROM CURRENT_DATE) - foundation_year + 1)::integer as years_of_impact_calc,
    CURRENT_TIMESTAMP as last_updated_calc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get campaign progress with real-time updates
CREATE OR REPLACE FUNCTION get_campaign_progress(campaign_uuid uuid DEFAULT NULL)
RETURNS TABLE (
  campaign_id uuid,
  campaign_name text,
  goal_amount decimal,
  raised_amount decimal,
  currency text,
  progress_percentage decimal,
  donors_count bigint,
  recent_donations_count bigint,
  status text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.goal_amount,
    c.raised_amount,
    c.currency,
    CASE 
      WHEN c.goal_amount > 0 THEN ROUND((c.raised_amount / c.goal_amount) * 100, 2)
      ELSE 0
    END as progress_percentage,
    COALESCE(d.donors_count, 0) as donors_count,
    COALESCE(d.recent_donations_count, 0) as recent_donations_count,
    c.status,
    c.created_at,
    c.updated_at
  FROM campaigns c
  LEFT JOIN (
    SELECT 
      campaign_id,
      COUNT(DISTINCT donor_email) as donors_count,
      COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_donations_count
    FROM donations 
    WHERE status = 'succeeded'
    GROUP BY campaign_id
  ) d ON c.id = d.campaign_id
  WHERE (campaign_uuid IS NULL OR c.id = campaign_uuid)
    AND c.status = 'active'
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the view (now that functions exist)
CREATE OR REPLACE VIEW donation_statistics AS
SELECT * FROM get_donation_impact_stats();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_donation_impact_stats() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_campaign_progress(uuid) TO anon, authenticated, service_role;
GRANT SELECT ON donation_statistics TO anon, authenticated, service_role;

-- Ensure the default campaign exists
INSERT INTO campaigns (name, description, goal_amount, currency, status) 
VALUES (
  'Youth Health Education Campaign',
  'Bringing healthcare knowledge to underserved communities through mobile clinics and educational programs',
  100000.00,
  'USD',
  'active'
) ON CONFLICT DO NOTHING;

-- Add some additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status_currency_amount ON donations(status, currency, amount);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_status ON donations(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status_name ON campaigns(status, name);