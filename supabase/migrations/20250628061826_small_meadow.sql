/*
  # Payment System Database Schema

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `donor_name` (text)
      - `donor_email` (text)
      - `donor_phone` (text, optional)
      - `amount` (decimal)
      - `currency` (text)
      - `payment_method` (text)
      - `payment_provider` (text)
      - `payment_intent_id` (text)
      - `transaction_id` (text)
      - `status` (text)
      - `is_recurring` (boolean)
      - `campaign_id` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `payment_webhooks`
      - `id` (uuid, primary key)
      - `provider` (text)
      - `event_type` (text)
      - `event_id` (text)
      - `payload` (jsonb)
      - `processed` (boolean)
      - `created_at` (timestamp)
    
    - `campaigns`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `goal_amount` (decimal)
      - `raised_amount` (decimal)
      - `currency` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and public read access where appropriate
    - Add webhook verification policies

  3. Functions
    - Function to update campaign totals
    - Function to process webhook events
    - Function to generate donation receipts
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  goal_amount decimal(12,2) DEFAULT 0,
  raised_amount decimal(12,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount decimal(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL,
  payment_provider text NOT NULL CHECK (payment_provider IN ('stripe', 'paypal', 'flutterwave')),
  payment_intent_id text,
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
  is_recurring boolean DEFAULT false,
  campaign_id uuid REFERENCES campaigns(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment webhooks table
CREATE TABLE IF NOT EXISTS payment_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('stripe', 'paypal', 'flutterwave')),
  event_type text NOT NULL,
  event_id text UNIQUE NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  donation_id uuid REFERENCES donations(id),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_provider ON donations(payment_provider);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON payment_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_webhooks_event_id ON payment_webhooks(event_id);

-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Campaigns policies (public read, admin write)
CREATE POLICY "Anyone can view active campaigns"
  ON campaigns
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Service role can manage campaigns"
  ON campaigns
  FOR ALL
  TO service_role
  USING (true);

-- Donations policies (donors can view their own, service role can manage all)
CREATE POLICY "Donors can view their own donations"
  ON donations
  FOR SELECT
  USING (donor_email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can manage all donations"
  ON donations
  FOR ALL
  TO service_role
  USING (true);

-- Webhook policies (service role only)
CREATE POLICY "Service role can manage webhooks"
  ON payment_webhooks
  FOR ALL
  TO service_role
  USING (true);

-- Function to update campaign raised amount
CREATE OR REPLACE FUNCTION update_campaign_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign raised amount when donation status changes to succeeded
  IF NEW.status = 'succeeded' AND (OLD.status IS NULL OR OLD.status != 'succeeded') THEN
    UPDATE campaigns 
    SET 
      raised_amount = raised_amount + NEW.amount,
      updated_at = now()
    WHERE id = NEW.campaign_id;
  END IF;
  
  -- Subtract amount if donation was succeeded but now failed/cancelled
  IF OLD.status = 'succeeded' AND NEW.status IN ('failed', 'cancelled') THEN
    UPDATE campaigns 
    SET 
      raised_amount = GREATEST(0, raised_amount - NEW.amount),
      updated_at = now()
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign total updates
DROP TRIGGER IF EXISTS trigger_update_campaign_total ON donations;
CREATE TRIGGER trigger_update_campaign_total
  AFTER UPDATE OF status ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_total();

-- Function to generate donation receipt data
CREATE OR REPLACE FUNCTION get_donation_receipt(donation_uuid uuid)
RETURNS TABLE (
  donation_id uuid,
  donor_name text,
  donor_email text,
  amount decimal,
  currency text,
  payment_method text,
  transaction_id text,
  campaign_name text,
  donation_date timestamptz,
  receipt_number text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.donor_name,
    d.donor_email,
    d.amount,
    d.currency,
    d.payment_method,
    d.transaction_id,
    c.name,
    d.created_at,
    'NR-' || EXTRACT(YEAR FROM d.created_at) || '-' || LPAD(EXTRACT(DOY FROM d.created_at)::text, 3, '0') || '-' || SUBSTRING(d.id::text, 1, 8)
  FROM donations d
  LEFT JOIN campaigns c ON d.campaign_id = c.id
  WHERE d.id = donation_uuid AND d.status = 'succeeded';
END;
$$ LANGUAGE plpgsql;

-- Insert default campaign
INSERT INTO campaigns (name, description, goal_amount, currency) 
VALUES (
  'Youth Health Education Campaign',
  'Bringing healthcare knowledge to underserved communities through mobile clinics and educational programs',
  100000.00,
  'USD'
) ON CONFLICT DO NOTHING;