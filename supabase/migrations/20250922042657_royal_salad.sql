/*
  # Create Token Transactions Table

  1. New Tables
    - `token_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `track_id` (uuid, optional foreign key to tracks)
      - `tokens_used` (integer) - Number of tokens used/refunded
      - `transaction_type` (text) - Type of transaction
      - `word_count` (integer) - Number of words processed
      - `estimated_cost` (decimal) - Estimated cost in USD
      - `metadata` (jsonb) - Additional transaction data
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `token_transactions` table
    - Add policy for users to read their own transactions
    - Add policy for system to create transactions

  3. Indexes
    - Index on user_id for user transaction history
    - Index on created_at for chronological queries
*/

CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id uuid, -- Will reference tracks table when created
  tokens_used integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('generation', 'refund', 'bonus', 'reset')),
  word_count integer DEFAULT 0,
  estimated_cost decimal(10,4) DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own transaction history
CREATE POLICY "Users can read own token transactions"
  ON token_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all transactions
CREATE POLICY "Service role can manage token transactions"
  ON token_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_transactions_type ON token_transactions(transaction_type);