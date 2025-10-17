/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique) - User's display name
      - `full_name` (text) - User's full name
      - `bio` (text) - User biography
      - `avatar_url` (text) - Profile picture URL
      - `cover_url` (text) - Profile cover image URL
      - `location` (text) - User location
      - `website` (text) - User website
      - `follower_count` (integer) - Number of followers
      - `following_count` (integer) - Number of users following
      - `track_count` (integer) - Number of tracks created
      - `playlist_count` (integer) - Number of playlists created
      - `total_plays` (integer) - Total plays across all tracks
      - `is_verified` (boolean) - Verified creator status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for public read access
    - Add policy for users to manage their own profile

  3. Functions
    - Function to create profile on user signup
    - Trigger to auto-create profile for new users
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  bio text DEFAULT '',
  avatar_url text,
  cover_url text,
  location text,
  website text,
  follower_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  track_count integer DEFAULT 0,
  playlist_count integer DEFAULT 0,
  total_plays integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public can read all user profiles
CREATE POLICY "Public can read user profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER create_user_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();