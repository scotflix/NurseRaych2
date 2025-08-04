-- Drop and recreate the function with proper column references
DROP FUNCTION IF EXISTS get_campaign_participation_stats();

CREATE OR REPLACE FUNCTION get_campaign_participation_stats()
RETURNS TABLE (
  campaign_name text,
  total_participants bigint,
  advocates_count bigint,
  educators_count bigint,
  donors_count bigint,
  volunteers_count bigint,
  recent_participants bigint,
  top_locations text[]
) AS $$
BEGIN
  RETURN QUERY
  WITH campaign_stats AS (
    SELECT 
      cp.campaign_name as camp_name,
      COUNT(*) as total_participants,
      COUNT(CASE WHEN cp.participant_role = 'advocate' THEN 1 END) as advocates_count,
      COUNT(CASE WHEN cp.participant_role = 'educator' THEN 1 END) as educators_count,
      COUNT(CASE WHEN cp.participant_role = 'donor' THEN 1 END) as donors_count,
      COUNT(CASE WHEN cp.participant_role = 'volunteer' THEN 1 END) as volunteers_count,
      COUNT(CASE WHEN cp.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_participants
    FROM campaign_participants cp
    GROUP BY cp.campaign_name
  ),
  location_stats AS (
    SELECT 
      loc.campaign_name as camp_name,
      ARRAY_AGG(loc.location ORDER BY loc.location_count DESC) FILTER (WHERE loc.location IS NOT NULL) as top_locations
    FROM (
      SELECT 
        cp2.campaign_name,
        cp2.location,
        COUNT(*) as location_count,
        ROW_NUMBER() OVER (PARTITION BY cp2.campaign_name ORDER BY COUNT(*) DESC) as rn
      FROM campaign_participants cp2
      WHERE cp2.location IS NOT NULL
      GROUP BY cp2.campaign_name, cp2.location
    ) loc
    WHERE loc.rn <= 5
    GROUP BY loc.campaign_name
  )
  SELECT 
    cs.camp_name,
    cs.total_participants,
    cs.advocates_count,
    cs.educators_count,
    cs.donors_count,
    cs.volunteers_count,
    cs.recent_participants,
    COALESCE(ls.top_locations, ARRAY[]::text[])
  FROM campaign_stats cs
  LEFT JOIN location_stats ls ON cs.camp_name = ls.camp_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to all user types
GRANT EXECUTE ON FUNCTION get_campaign_participation_stats() TO anon, authenticated, service_role;

-- Ensure the add_campaign_participant function has proper permissions
GRANT EXECUTE ON FUNCTION add_campaign_participant(text, text, text, text, text, text, jsonb) TO anon, authenticated, service_role;

-- Add policy to allow anonymous users to read campaign participation stats
-- This is needed for the public-facing campaign stats display
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_participants' 
    AND policyname = 'Anyone can view campaign participation stats'
  ) THEN
    CREATE POLICY "Anyone can view campaign participation stats"
      ON campaign_participants
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Ensure the existing policies are properly configured
DO $$
BEGIN
  -- Check if the insert policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_participants' 
    AND policyname = 'Anyone can join campaigns'
  ) THEN
    CREATE POLICY "Anyone can join campaigns"
      ON campaign_participants
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  -- Check if the select policy for own data exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_participants' 
    AND policyname = 'Participants can view their own participation'
  ) THEN
    CREATE POLICY "Participants can view their own participation"
      ON campaign_participants
      FOR SELECT
      USING (participant_email = auth.jwt() ->> 'email');
  END IF;

  -- Check if service role policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_participants' 
    AND policyname = 'Service role can manage all participants'
  ) THEN
    CREATE POLICY "Service role can manage all participants"
      ON campaign_participants
      FOR ALL
      TO service_role
      USING (true);
  END IF;
END $$;

-- Grant SELECT permission on campaign_participants table to anon and authenticated users
-- This is required for the RLS policies to work properly
GRANT SELECT ON campaign_participants TO anon, authenticated;
GRANT INSERT ON campaign_participants TO anon, authenticated;

-- Ensure proper permissions on the campaigns table as well
GRANT SELECT ON campaigns TO anon, authenticated;

-- Add some test data if the table is empty (for development/testing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM campaign_participants LIMIT 1) THEN
    INSERT INTO campaign_participants (campaign_name, participant_name, participant_email, participant_role, location, time_commitment) VALUES
    ('Maternal Wellness Campaign', 'Sarah Wanjiku', 'sarah.w@example.com', 'advocate', 'Kenya', '1-2 hours/week'),
    ('Maternal Wellness Campaign', 'Grace Achieng', 'grace.a@example.com', 'educator', 'Kenya', '5+ hours/week'),
    ('Youth Health Education', 'John Mwangi', 'john.m@example.com', 'volunteer', 'Kenya', '1-2 hours/week'),
    ('Youth Health Education', 'Mary Njeri', 'mary.n@example.com', 'advocate', 'Tanzania', '5 mins/week'),
    ('Mental Health Awareness', 'David Ochieng', 'david.o@example.com', 'educator', 'Uganda', '1-2 hours/week'),
    ('Mental Health Awareness', 'Faith Wambui', 'faith.w@example.com', 'volunteer', 'Kenya', '5+ hours/week');
  END IF;
END $$;