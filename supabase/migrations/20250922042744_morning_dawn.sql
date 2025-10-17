/*
  # Create Playlist Followers Table

  1. New Tables
    - `playlist_followers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `playlist_id` (uuid, foreign key to playlists)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `playlist_followers` table
    - Add policy for users to manage their own follows

  3. Constraints
    - Unique constraint on user_id + playlist_id

  4. Functions
    - Function to update playlist follower count
    - Triggers to maintain follower statistics
*/

CREATE TABLE IF NOT EXISTS playlist_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, playlist_id)
);

ALTER TABLE playlist_followers ENABLE ROW LEVEL SECURITY;

-- Users can read their own follows
CREATE POLICY "Users can read own playlist follows"
  ON playlist_followers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own follows
CREATE POLICY "Users can create own playlist follows"
  ON playlist_followers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own follows
CREATE POLICY "Users can delete own playlist follows"
  ON playlist_followers
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_playlist_followers_user_id ON playlist_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_followers_playlist_id ON playlist_followers(playlist_id);

-- Function to update playlist follower count
CREATE OR REPLACE FUNCTION update_playlist_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update follower count for the affected playlist
  UPDATE playlists SET
    follower_count = (
      SELECT COUNT(*) 
      FROM playlist_followers 
      WHERE playlist_id = COALESCE(NEW.playlist_id, OLD.playlist_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.playlist_id, OLD.playlist_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers to update playlist follower count
CREATE TRIGGER update_playlist_follower_count_on_insert
  AFTER INSERT ON playlist_followers
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_follower_count();

CREATE TRIGGER update_playlist_follower_count_on_delete
  AFTER DELETE ON playlist_followers
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_follower_count();