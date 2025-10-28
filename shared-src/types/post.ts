// Type definitions for post data structures

export enum PostType {
  ARTICLE = 'article',
  EVENT = 'event',
  VACANCY = 'vacancy',
  POLL = 'poll'
}

export interface Post {
  id: string
  url: string
  slug?: string
  title: string
  content: string
  images: string[]
  author_id: string
  created_at: string
  updated_at: string
  type: PostType
  is_featured: boolean
  is_saved?: boolean
}

export interface PostAuthor {
  id: string
  name: string | null
  username: string | null
  avatar_url: string | null
  badge: string[] | null
  telegram_username: string | null
  city: string | null
  country: string | null
}

export interface PostWithAuthor extends Post {
  author: PostAuthor
}

export type FeedView = 'featured' | 'all' | 'following' | 'saved'
