/*
  # Create User Likes Table

  1. New Tables
    - `user_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `track_id` (uuid, foreign key to tracks)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_likes` table
    - Add policy for users to manage their own likes

  3. Constraints
    - Unique constraint on user_id + track_id

  4. Functions
    - Function to update track like count
    - Triggers to maintain like statistics
*/

CREATE TABLE IF NOT EXISTS user_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, track_id)
);

ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Users can read their own likes
CREATE POLICY "Users can read own likes"
  ON user_likes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own likes
CREATE POLICY "Users can create own likes"
  ON user_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON user_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_track_id ON user_likes(track_id);

-- Function to update track like count
CREATE OR REPLACE FUNCTION update_track_like_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update like count for the affected track
  UPDATE tracks SET
    like_count = (
      SELECT COUNT(*) 
      FROM user_likes 
      WHERE track_id = COALESCE(NEW.track_id, OLD.track_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.track_id, OLD.track_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers to update track like count
CREATE TRIGGER update_track_like_count_on_insert
  AFTER INSERT ON user_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_track_like_count();

CREATE TRIGGER update_track_like_count_on_delete
  AFTER DELETE ON user_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_track_like_count();