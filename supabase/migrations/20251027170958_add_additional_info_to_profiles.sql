/*
  # Add additional_info column to profiles table

  1. Changes
    - Add `additional_info` column to `profiles` table as text field
    - This field will store free-form additional information about the user
    - Similar to the `about` field but for supplementary details

  2. Notes
    - This is a non-breaking change - existing profiles will have null values
    - No RLS changes needed - inherits existing profile policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'additional_info'
  ) THEN
    ALTER TABLE profiles ADD COLUMN additional_info text;
  END IF;
END $$;
