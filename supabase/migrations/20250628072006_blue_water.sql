/*
  # Add Statistics Functions and Views

  1. Functions
    - Function to calculate real-time statistics
    - Function to get donation impact metrics
    
  2. Views
    - Real-time donation statistics view
    - Campaign progress view
*/

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
  foundation_year integer := 2016;
  lives_per_community integer := 5000;
  base_lives integer := 5000;
  base_communities integer := 20;
  usd_per_life decimal := 10.0;
  total_usd decimal := 0;
  donation_count bigint := 0;
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
  
  -- Calculate derived statistics
  RETURN QUERY SELECT
    donation_count,
    total_usd,
    (base_lives + FLOOR(total_usd / usd_per_life))::integer as lives_touched_calc,
    (base_communities + FLOOR((base_lives + FLOOR(total_usd / usd_per_life)) / lives_per_community))::integer as communities_served_calc,
    (EXTRACT(YEAR FROM CURRENT_DATE) - foundation_year + 1)::integer as years_of_impact_calc,
    CURRENT_TIMESTAMP as last_updated_calc;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy access to donation statistics
CREATE OR REPLACE VIEW donation_statistics AS
SELECT * FROM get_donation_impact_stats();

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
$$ LANGUAGE plpgsql;

-- Create indexes for better performance on statistics queries
CREATE INDEX IF NOT EXISTS idx_donations_status_currency ON donations(status, currency);
CREATE INDEX IF NOT EXISTS idx_donations_status_amount ON donations(status, amount);
CREATE INDEX IF NOT EXISTS idx_donations_status_created_at ON donations(status, created_at);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_donation_impact_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_campaign_progress(uuid) TO anon, authenticated;
GRANT SELECT ON donation_statistics TO anon, authenticated;