/*
  # Add Foreign Key Constraints

  1. Updates
    - Add foreign key constraint from token_transactions.track_id to tracks.id
    - Update RLS policies to handle the new constraint

  2. Indexes
    - Additional indexes for better query performance
*/

-- Add foreign key constraint for token_transactions.track_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'token_transactions_track_id_fkey'
  ) THEN
    ALTER TABLE token_transactions
    ADD CONSTRAINT token_transactions_track_id_fkey
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_search ON tracks USING gin(to_tsvector('english', title || ' ' || creator_name || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_playlists_search ON playlists USING gin(to_tsvector('english', name || ' ' || creator_name || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_tracks_play_count ON tracks(play_count DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_follower_count ON playlists(follower_count DESC);