/*
  # Create Tracks Table

  1. New Tables
    - `tracks`
      - `id` (uuid, primary key)
      - `title` (text) - Track title
      - `creator_id` (uuid, foreign key to auth.users)
      - `creator_name` (text) - Display name of creator
      - `duration` (text) - Duration in MM:SS format
      - `type` (text) - Content type (podcast, audio-drama, etc.)
      - `cover_url` (text) - URL to cover image
      - `audio_url` (text) - URL to audio file
      - `description` (text) - Track description
      - `word_count` (integer) - Original document word count
      - `tokens_used` (integer) - Tokens used for generation
      - `is_public` (boolean) - Whether track is publicly visible
      - `play_count` (integer) - Number of times played
      - `like_count` (integer) - Number of likes
      - `metadata` (jsonb) - Additional track metadata
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tracks` table
    - Add policy for public read access to public tracks
    - Add policy for creators to manage their own tracks

  3. Indexes
    - Index on creator_id for user tracks
    - Index on type for category filtering
    - Index on is_public for public track queries
*/

CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name text NOT NULL,
  duration text NOT NULL DEFAULT '0:00',
  type text NOT NULL CHECK (type IN ('podcast', 'audio-drama', 'slow-content', 'solo-narration')),
  cover_url text,
  audio_url text,
  description text DEFAULT '',
  word_count integer DEFAULT 0,
  tokens_used integer DEFAULT 0,
  is_public boolean DEFAULT true,
  play_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Public can read public tracks
CREATE POLICY "Public can read public tracks"
  ON tracks
  FOR SELECT
  TO public
  USING (is_public = true);

-- Authenticated users can read all public tracks
CREATE POLICY "Authenticated users can read public tracks"
  ON tracks
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Users can read their own tracks (public or private)
CREATE POLICY "Users can read own tracks"
  ON tracks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

-- Users can create their own tracks
CREATE POLICY "Users can create own tracks"
  ON tracks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Users can update their own tracks
CREATE POLICY "Users can update own tracks"
  ON tracks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Users can delete their own tracks
CREATE POLICY "Users can delete own tracks"
  ON tracks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_creator_id ON tracks(creator_id);
CREATE INDEX IF NOT EXISTS idx_tracks_type ON tracks(type);
CREATE INDEX IF NOT EXISTS idx_tracks_public ON tracks(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at DESC);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();