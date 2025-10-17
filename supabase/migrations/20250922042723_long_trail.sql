/*
  # Create Playlist Tracks Junction Table

  1. New Tables
    - `playlist_tracks`
      - `id` (uuid, primary key)
      - `playlist_id` (uuid, foreign key to playlists)
      - `track_id` (uuid, foreign key to tracks)
      - `position` (integer) - Order of track in playlist
      - `added_by` (uuid, foreign key to auth.users)
      - `added_at` (timestamp)

  2. Security
    - Enable RLS on `playlist_tracks` table
    - Add policy for public read access to public playlist tracks
    - Add policy for playlist owners to manage tracks

  3. Constraints
    - Unique constraint on playlist_id + track_id
    - Unique constraint on playlist_id + position

  4. Functions
    - Function to update playlist track count
    - Triggers to maintain playlist statistics
*/

CREATE TABLE IF NOT EXISTS playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  position integer NOT NULL,
  added_by uuid NOT NULL REFERENCES auth.users(id),
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, track_id),
  UNIQUE(playlist_id, position)
);

ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Public can read tracks from public playlists
CREATE POLICY "Public can read public playlist tracks"
  ON playlist_tracks
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.is_public = true
    )
  );

-- Authenticated users can read tracks from public playlists
CREATE POLICY "Authenticated users can read public playlist tracks"
  ON playlist_tracks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.is_public = true
    )
  );

-- Users can read tracks from their own playlists
CREATE POLICY "Users can read own playlist tracks"
  ON playlist_tracks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.creator_id = auth.uid()
    )
  );

-- Playlist owners can manage their playlist tracks
CREATE POLICY "Playlist owners can manage playlist tracks"
  ON playlist_tracks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.creator_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON playlist_tracks(playlist_id, position);

-- Function to update playlist statistics
CREATE OR REPLACE FUNCTION update_playlist_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update track count and total duration for the affected playlist
  UPDATE playlists SET
    track_count = (
      SELECT COUNT(*) 
      FROM playlist_tracks 
      WHERE playlist_id = COALESCE(NEW.playlist_id, OLD.playlist_id)
    ),
    total_duration = (
      SELECT COALESCE(SUM(
        CASE 
          WHEN tracks.duration ~ '^\d+:\d+$' THEN
            (split_part(tracks.duration, ':', 1)::integer * 60) + 
            split_part(tracks.duration, ':', 2)::integer
          ELSE 0
        END
      ), 0)
      FROM playlist_tracks
      JOIN tracks ON tracks.id = playlist_tracks.track_id
      WHERE playlist_tracks.playlist_id = COALESCE(NEW.playlist_id, OLD.playlist_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.playlist_id, OLD.playlist_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers to update playlist statistics
CREATE TRIGGER update_playlist_stats_on_insert
  AFTER INSERT ON playlist_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_stats();

CREATE TRIGGER update_playlist_stats_on_delete
  AFTER DELETE ON playlist_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_stats();