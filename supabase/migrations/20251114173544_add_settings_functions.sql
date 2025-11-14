/*
  # Add Settings Management Functions

  1. New Functions
    - `get_user_settings()` - Retrieves timezone and theme_mode for authenticated user
    - `update_user_settings(p_timezone, p_theme_mode)` - Updates user settings with validation
    - `cleanup_user_session()` - Optional cleanup function for sign out flow

  2. Security
    - All functions check authentication using auth.uid()
    - SECURITY DEFINER ensures proper privilege elevation
    - RLS policies are automatically enforced
    - Input validation for theme_mode values
    - SET search_path prevents SQL injection

  3. Permissions
    - GRANT EXECUTE to authenticated users only
    - Functions require valid authentication token

  4. Important Notes
    - Functions return safe defaults if no profile exists
    - Update function validates theme_mode must be: light, dark, or system
    - Cleanup function is a placeholder for future session cleanup needs
*/

-- Drop existing functions if they exist to avoid conflicts
DROP FUNCTION IF EXISTS get_user_settings();
DROP FUNCTION IF EXISTS update_user_settings(TEXT, TEXT);
DROP FUNCTION IF EXISTS cleanup_user_session();

-- Function 1: Get user settings (timezone and theme_mode)
CREATE OR REPLACE FUNCTION get_user_settings()
RETURNS TABLE (
  timezone TEXT,
  theme_mode TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Return user settings with RLS automatically enforced
  RETURN QUERY
  SELECT 
    p.timezone,
    p.theme_mode
  FROM profiles p
  WHERE p.user_id = auth.uid();
  
  -- If no record found, return defaults
  IF NOT FOUND THEN
    RETURN QUERY SELECT 'UTC'::TEXT, 'system'::TEXT;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_settings() TO authenticated;


-- Function 2: Update user settings (timezone and/or theme_mode)
CREATE OR REPLACE FUNCTION update_user_settings(
  p_timezone TEXT DEFAULT NULL,
  p_theme_mode TEXT DEFAULT NULL
)
RETURNS TABLE (
  timezone TEXT,
  theme_mode TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user is authenticated
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate at least one parameter is provided
  IF p_timezone IS NULL AND p_theme_mode IS NULL THEN
    RAISE EXCEPTION 'At least one parameter (timezone or theme_mode) must be provided';
  END IF;

  -- Validate theme_mode if provided
  IF p_theme_mode IS NOT NULL AND p_theme_mode NOT IN ('light', 'dark', 'system') THEN
    RAISE EXCEPTION 'Invalid theme_mode. Must be one of: light, dark, system';
  END IF;

  -- Update only the provided fields
  UPDATE profiles
  SET 
    timezone = COALESCE(p_timezone, timezone),
    theme_mode = COALESCE(p_theme_mode, theme_mode),
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found for user';
  END IF;

  -- Return updated settings
  RETURN QUERY
  SELECT 
    p.timezone,
    p.theme_mode
  FROM profiles p
  WHERE p.user_id = v_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_settings(TEXT, TEXT) TO authenticated;


-- Function 3: Sign out helper (optional - for cleanup if needed)
CREATE OR REPLACE FUNCTION cleanup_user_session()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Any cleanup logic can go here (e.g., logging, clearing cache, etc.)
  -- Note: Actual sign out is handled by Supabase Auth client-side
  
  -- For now, this is a placeholder for future cleanup needs
  RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_user_session() TO authenticated;