/*
  # Fix donations table RLS policy

  1. Security Updates
    - Add policy to allow anonymous users to insert donations
    - Keep existing policies for viewing donations
    - Ensure service role can still manage all donations

  2. Changes
    - Add "Anyone can create donations" policy for INSERT operations
    - This allows the frontend to create donation records without authentication
*/

-- Add policy to allow anonymous users to create donations
CREATE POLICY "Anyone can create donations"
  ON donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing policies are still in place
-- (These should already exist from previous migrations)

-- Policy for donors to view their own donations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'donations' 
    AND policyname = 'Donors can view their own donations'
  ) THEN
    CREATE POLICY "Donors can view their own donations"
      ON donations
      FOR SELECT
      USING (donor_email = auth.jwt() ->> 'email');
  END IF;
END $$;

-- Policy for service role to manage all donations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'donations' 
    AND policyname = 'Service role can manage all donations'
  ) THEN
    CREATE POLICY "Service role can manage all donations"
      ON donations
      FOR ALL
      TO service_role
      USING (true);
  END IF;
END $$;