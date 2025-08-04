/*
  # Campaign Participation Tracking

  1. New Tables
    - `campaign_participants`
      - `id` (uuid, primary key)
      - `campaign_name` (text)
      - `participant_name` (text)
      - `participant_email` (text)
      - `participant_role` (text)
      - `location` (text)
      - `time_commitment` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on campaign_participants table
    - Add policies for public insert and service role management

  3. Functions
    - Function to get campaign participation stats
    - Function to track new participants
*/

-- Create campaign participants table
CREATE TABLE IF NOT EXISTS campaign_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name text NOT NULL,
  participant_name text NOT NULL,
  participant_email text NOT NULL,
  participant_role text DEFAULT 'advocate' CHECK (participant_role IN ('advocate', 'educator', 'donor', 'volunteer')),
  location text,
  time_commitment text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign ON campaign_participants(campaign_name);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_role ON campaign_participants(participant_role);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_created_at ON campaign_participants(created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_email ON campaign_participants(participant_email);

-- Enable Row Level Security
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;

-- Policies for campaign participants
CREATE POLICY "Anyone can join campaigns"
  ON campaign_participants
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Participants can view their own participation"
  ON campaign_participants
  FOR SELECT
  USING (participant_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can manage all participants"
  ON campaign_participants
  FOR ALL
  TO service_role
  USING (true);

-- Function to get campaign participation statistics
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
      cp.campaign_name,
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
      cp.campaign_name,
      ARRAY_AGG(cp.location ORDER BY location_count DESC) FILTER (WHERE cp.location IS NOT NULL) as top_locations
    FROM (
      SELECT 
        campaign_name,
        location,
        COUNT(*) as location_count,
        ROW_NUMBER() OVER (PARTITION BY campaign_name ORDER BY COUNT(*) DESC) as rn
      FROM campaign_participants
      WHERE location IS NOT NULL
      GROUP BY campaign_name, location
    ) cp
    WHERE cp.rn <= 5
    GROUP BY cp.campaign_name
  )
  SELECT 
    cs.campaign_name,
    cs.total_participants,
    cs.advocates_count,
    cs.educators_count,
    cs.donors_count,
    cs.volunteers_count,
    cs.recent_participants,
    COALESCE(ls.top_locations, ARRAY[]::text[])
  FROM campaign_stats cs
  LEFT JOIN location_stats ls ON cs.campaign_name = ls.campaign_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add campaign participant
CREATE OR REPLACE FUNCTION add_campaign_participant(
  p_campaign_name text,
  p_participant_name text,
  p_participant_email text,
  p_participant_role text DEFAULT 'advocate',
  p_location text DEFAULT NULL,
  p_time_commitment text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  participant_id uuid;
BEGIN
  -- Check if participant already exists for this campaign
  SELECT id INTO participant_id
  FROM campaign_participants
  WHERE campaign_name = p_campaign_name 
    AND participant_email = p_participant_email;
  
  IF participant_id IS NOT NULL THEN
    -- Update existing participant
    UPDATE campaign_participants
    SET 
      participant_role = p_participant_role,
      location = COALESCE(p_location, location),
      time_commitment = COALESCE(p_time_commitment, time_commitment),
      metadata = p_metadata,
      updated_at = now()
    WHERE id = participant_id;
    
    RETURN participant_id;
  ELSE
    -- Insert new participant
    INSERT INTO campaign_participants (
      campaign_name,
      participant_name,
      participant_email,
      participant_role,
      location,
      time_commitment,
      metadata
    ) VALUES (
      p_campaign_name,
      p_participant_name,
      p_participant_email,
      p_participant_role,
      p_location,
      p_time_commitment,
      p_metadata
    ) RETURNING id INTO participant_id;
    
    RETURN participant_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_campaign_participation_stats() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION add_campaign_participant(text, text, text, text, text, text, jsonb) TO anon, authenticated, service_role;

-- Insert some sample campaign data to get started
INSERT INTO campaign_participants (campaign_name, participant_name, participant_email, participant_role, location, time_commitment) VALUES
('Maternal Wellness Campaign', 'Sarah Wanjiku', 'sarah.w@example.com', 'advocate', 'Kenya', '1-2 hours/week'),
('Maternal Wellness Campaign', 'Grace Achieng', 'grace.a@example.com', 'educator', 'Kenya', '5+ hours/week'),
('Youth Health Education', 'John Mwangi', 'john.m@example.com', 'volunteer', 'Kenya', '1-2 hours/week'),
('Youth Health Education', 'Mary Njeri', 'mary.n@example.com', 'advocate', 'Tanzania', '5 mins/week'),
('Mental Health Awareness', 'David Ochieng', 'david.o@example.com', 'educator', 'Uganda', '1-2 hours/week'),
('Mental Health Awareness', 'Faith Wambui', 'faith.w@example.com', 'volunteer', 'Kenya', '5+ hours/week')
ON CONFLICT DO NOTHING;