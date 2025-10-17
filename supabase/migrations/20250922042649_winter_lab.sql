/*
  # Create User Tokens Table

  1. New Tables
    - `user_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `total_tokens` (integer) - Total tokens available this period
      - `used_tokens` (integer) - Tokens used this period
      - `remaining_tokens` (integer) - Computed field for remaining tokens
      - `last_reset_date` (timestamp) - When tokens were last reset
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_tokens` table
    - Add policy for users to read their own token balance
    - Add policy for system to update token usage

  3. Functions
    - Function to automatically calculate remaining tokens
    - Trigger to update remaining_tokens on changes
*/

CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_tokens integer NOT NULL DEFAULT 0,
  used_tokens integer NOT NULL DEFAULT 0,
  remaining_tokens integer GENERATED ALWAYS AS (total_tokens - used_tokens) STORED,
  last_reset_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Users can read their own token balance
CREATE POLICY "Users can read own token balance"
  ON user_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow system to update token usage (for service role)
CREATE POLICY "Service role can manage tokens"
  ON user_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();