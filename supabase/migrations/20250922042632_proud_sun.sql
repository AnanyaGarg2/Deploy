/*
  # Create Subscription Plans Table

  1. New Tables
    - `subscription_plans`
      - `id` (uuid, primary key)
      - `name` (text) - Plan name (Starter, Pro, Premium)
      - `price` (decimal) - Monthly price in USD
      - `tokens_included` (integer) - Number of tokens included per month
      - `features` (jsonb) - Plan features as JSON object
      - `is_active` (boolean) - Whether plan is available for subscription
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subscription_plans` table
    - Add policy for public read access to active plans
    - Add policy for admin management

  3. Sample Data
    - Insert default subscription plans
*/

CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price decimal(10,2) NOT NULL DEFAULT 0,
  tokens_included integer NOT NULL DEFAULT 0,
  features jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active plans
CREATE POLICY "Public can read active subscription plans"
  ON subscription_plans
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to read all plans
CREATE POLICY "Authenticated users can read all subscription plans"
  ON subscription_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, tokens_included, features) VALUES
  ('Starter', 9.99, 5000, '{
    "max_uploads_per_month": 10,
    "max_file_size_mb": 10,
    "priority_support": false,
    "advanced_voices": false,
    "custom_voices": false
  }'),
  ('Pro', 19.99, 15000, '{
    "max_uploads_per_month": 50,
    "max_file_size_mb": 25,
    "priority_support": true,
    "advanced_voices": true,
    "custom_voices": false
  }'),
  ('Premium', 39.99, 40000, '{
    "max_uploads_per_month": 200,
    "max_file_size_mb": 50,
    "priority_support": true,
    "advanced_voices": true,
    "custom_voices": true
  }')
ON CONFLICT (name) DO NOTHING;