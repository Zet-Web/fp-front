// Type definitions for post data structures

export enum PostType {
  ARTICLE = 'article',
  EVENT = 'event',
  VACANCY = 'vacancy',
  QUIZ = 'quiz'
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Post {
  id: number
  url: string
  slug?: string
  title?: string
  excerpt: string
  content?: string
  cover_image?: string
  images: string[]
  author_id: string
  created_at: string
  updated_at: string
  type: PostType
  status: PostStatus
  is_pinned: boolean
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
