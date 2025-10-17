/*
  # Create Database Functions

  1. Functions
    - `use_tokens` - Function to safely use tokens with atomic operations
    - `reset_monthly_tokens` - Function to reset tokens monthly
    - `get_user_stats` - Function to get comprehensive user statistics
    - `search_content` - Function for full-text search across tracks and playlists

  2. Security
    - Functions use SECURITY DEFINER for elevated permissions
    - Proper validation and error handling
*/

-- Function to safely use tokens
CREATE OR REPLACE FUNCTION use_tokens(
  p_user_id uuid,
  p_track_id uuid,
  p_tokens_needed integer,
  p_word_count integer DEFAULT 0
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_tokens integer;
  estimated_cost decimal;
BEGIN
  -- Get current token balance
  SELECT remaining_tokens INTO current_tokens
  FROM user_tokens
  WHERE user_id = p_user_id;
  
  -- Check if user has enough tokens
  IF current_tokens IS NULL OR current_tokens < p_tokens_needed THEN
    RETURN false;
  END IF;
  
  -- Calculate estimated cost (assuming $0.0001 per token)
  estimated_cost := p_tokens_needed * 0.0001;
  
  -- Update token usage
  UPDATE user_tokens
  SET 
    used_tokens = used_tokens + p_tokens_needed,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO token_transactions (
    user_id,
    track_id,
    tokens_used,
    transaction_type,
    word_count,
    estimated_cost
  ) VALUES (
    p_user_id,
    p_track_id,
    p_tokens_needed,
    'generation',
    p_word_count,
    estimated_cost
  );
  
  RETURN true;
END;
$$;

-- Function to reset monthly tokens
CREATE OR REPLACE FUNCTION reset_monthly_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset tokens for all active subscriptions
  UPDATE user_tokens
  SET 
    used_tokens = 0,
    total_tokens = (
      SELECT sp.tokens_included
      FROM user_subscriptions us
      JOIN subscription_plans sp ON sp.id = us.plan_id
      WHERE us.user_id = user_tokens.user_id
      AND us.status = 'active'
      AND us.current_period_end > now()
    ),
    last_reset_date = now(),
    updated_at = now()
  WHERE user_id IN (
    SELECT us.user_id
    FROM user_subscriptions us
    WHERE us.status = 'active'
    AND us.current_period_end > now()
  );
  
  -- Record reset transactions
  INSERT INTO token_transactions (user_id, tokens_used, transaction_type, word_count, estimated_cost)
  SELECT 
    ut.user_id,
    0,
    'reset',
    0,
    0
  FROM user_tokens ut
  WHERE ut.last_reset_date = now();
END;
$$;

-- Function to get comprehensive user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_tracks', COALESCE(track_stats.total_tracks, 0),
    'total_playlists', COALESCE(playlist_stats.total_playlists, 0),
    'total_plays', COALESCE(track_stats.total_plays, 0),
    'total_likes', COALESCE(track_stats.total_likes, 0),
    'followers', COALESCE(profile_stats.follower_count, 0),
    'following', COALESCE(profile_stats.following_count, 0),
    'tokens_used_this_month', COALESCE(token_stats.used_tokens, 0),
    'tokens_remaining', COALESCE(token_stats.remaining_tokens, 0)
  ) INTO result
  FROM (
    SELECT 
      COUNT(*) as total_tracks,
      SUM(play_count) as total_plays,
      SUM(like_count) as total_likes
    FROM tracks
    WHERE creator_id = p_user_id
  ) track_stats
  CROSS JOIN (
    SELECT COUNT(*) as total_playlists
    FROM playlists
    WHERE creator_id = p_user_id
  ) playlist_stats
  CROSS JOIN (
    SELECT follower_count, following_count
    FROM user_profiles
    WHERE id = p_user_id
  ) profile_stats
  CROSS JOIN (
    SELECT used_tokens, remaining_tokens
    FROM user_tokens
    WHERE user_id = p_user_id
  ) token_stats;
  
  RETURN result;
END;
$$;

-- Function for full-text search
CREATE OR REPLACE FUNCTION search_content(
  search_query text,
  content_type text DEFAULT 'all',
  limit_count integer DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  tracks_result jsonb;
  playlists_result jsonb;
BEGIN
  -- Search tracks
  IF content_type IN ('all', 'tracks') THEN
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'title', t.title,
        'creator_name', t.creator_name,
        'type', t.type,
        'duration', t.duration,
        'cover_url', t.cover_url,
        'play_count', t.play_count,
        'like_count', t.like_count,
        'created_at', t.created_at,
        'content_type', 'track'
      )
    ) INTO tracks_result
    FROM tracks t
    WHERE t.is_public = true
    AND (
      t.title ILIKE '%' || search_query || '%'
      OR t.creator_name ILIKE '%' || search_query || '%'
      OR t.description ILIKE '%' || search_query || '%'
    )
    ORDER BY 
      CASE 
        WHEN t.title ILIKE search_query || '%' THEN 1
        WHEN t.title ILIKE '%' || search_query || '%' THEN 2
        ELSE 3
      END,
      t.play_count DESC
    LIMIT limit_count;
  END IF;
  
  -- Search playlists
  IF content_type IN ('all', 'playlists') THEN
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'creator_name', p.creator_name,
        'description', p.description,
        'cover_url', p.cover_url,
        'track_count', p.track_count,
        'follower_count', p.follower_count,
        'created_at', p.created_at,
        'content_type', 'playlist'
      )
    ) INTO playlists_result
    FROM playlists p
    WHERE p.is_public = true
    AND (
      p.name ILIKE '%' || search_query || '%'
      OR p.creator_name ILIKE '%' || search_query || '%'
      OR p.description ILIKE '%' || search_query || '%'
    )
    ORDER BY 
      CASE 
        WHEN p.name ILIKE search_query || '%' THEN 1
        WHEN p.name ILIKE '%' || search_query || '%' THEN 2
        ELSE 3
      END,
      p.follower_count DESC
    LIMIT limit_count;
  END IF;
  
  -- Combine results
  result := jsonb_build_object(
    'tracks', COALESCE(tracks_result, '[]'::jsonb),
    'playlists', COALESCE(playlists_result, '[]'::jsonb)
  );
  
  RETURN result;
END;
$$;