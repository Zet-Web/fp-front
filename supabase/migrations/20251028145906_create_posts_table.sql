/*
  # Create posts table

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for the post
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Post title
      - `content` (text) - Full post content/description
      - `images` (text[]) - Array of image URLs
      - `author_id` (uuid, foreign key) - Reference to profiles table
      - `type` (text) - Post type: article, event, vacancy, poll
      - `is_featured` (boolean) - Whether post is featured
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `posts` table
    - Add policy for anyone to read posts
    - Add policy for authenticated users to create posts
    - Add policy for users to update their own posts
    - Add policy for users to delete their own posts

  3. Indexes
    - Index on author_id for faster author queries
    - Index on type for filtering by post type
    - Index on created_at for sorting
    - Index on slug for URL lookups
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  images text[] DEFAULT '{}',
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'article',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND author_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (author_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (author_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (author_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
