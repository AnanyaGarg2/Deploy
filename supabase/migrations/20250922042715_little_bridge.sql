/*
  # Create Playlists Table

  1. New Tables
    - `playlists`
      - `id` (uuid, primary key)
      - `name` (text) - Playlist name
      - `creator_id` (uuid, foreign key to auth.users)
      - `creator_name` (text) - Display name of creator
      - `description` (text) - Playlist description
      - `cover_url` (text) - URL to cover image
      - `is_public` (boolean) - Whether playlist is publicly visible
      - `follower_count` (integer) - Number of followers
      - `track_count` (integer) - Number of tracks in playlist
      - `total_duration` (integer) - Total duration in seconds
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `playlists` table
    - Add policy for public read access to public playlists
    - Add policy for creators to manage their own playlists

  3. Indexes
    - Index on creator_id for user playlists
    - Index on is_public for public playlist queries
*/

CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name text NOT NULL,
  description text DEFAULT '',
  cover_url text,
  is_public boolean DEFAULT true,
  follower_count integer DEFAULT 0,
  track_count integer DEFAULT 0,
  total_duration integer DEFAULT 0, -- in seconds
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Public can read public playlists
CREATE POLICY "Public can read public playlists"
  ON playlists
  FOR SELECT
  TO public
  USING (is_public = true);

-- Authenticated users can read all public playlists
CREATE POLICY "Authenticated users can read public playlists"
  ON playlists
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Users can read their own playlists (public or private)
CREATE POLICY "Users can read own playlists"
  ON playlists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

-- Users can create their own playlists
CREATE POLICY "Users can create own playlists"
  ON playlists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Users can update their own playlists
CREATE POLICY "Users can update own playlists"
  ON playlists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Users can delete their own playlists
CREATE POLICY "Users can delete own playlists"
  ON playlists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_playlists_creator_id ON playlists(creator_id);
CREATE INDEX IF NOT EXISTS idx_playlists_public ON playlists(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON playlists(created_at DESC);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();