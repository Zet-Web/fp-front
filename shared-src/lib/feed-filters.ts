// Feed filter utilities and logic for filtering posts

import { PostType, type PostWithAuthor, type FeedView } from "../types/post"

export interface FeedFilters {
  view: FeedView
  postType: PostType | null
  location: { country: string | null; city: string | null }
}

export const DEFAULT_FILTERS: FeedFilters = {
  view: 'featured',
  postType: null,
  location: { country: null, city: null }
}

export function applyFeedFilters(
  posts: PostWithAuthor[],
  filters: FeedFilters,
  followedUserIds: string[]
): PostWithAuthor[] {
  let filtered = [...posts]

  switch (filters.view) {
    case 'featured':
      filtered = filtered.filter(post => post.is_featured)
      break
    case 'following':
      filtered = filtered.filter(post => followedUserIds.includes(post.author_id))
      break
    case 'saved':
      filtered = filtered.filter(post => post.is_saved === true)
      break
    case 'all':
    default:
      break
  }

  if (filters.postType) {
    filtered = filtered.filter(post => post.type === filters.postType)
  }

  if (filters.location.country) {
    filtered = filtered.filter(post => post.author.country === filters.location.country)

    if (filters.location.city) {
      filtered = filtered.filter(post => post.author.city === filters.location.city)
    }
  }

  return filtered
}

export function getUniqueCountries(posts: PostWithAuthor[]): string[] {
  const countries = new Set<string>()
  posts.forEach(post => {
    if (post.author.country) {
      countries.add(post.author.country)
    }
  })
  return Array.from(countries).sort()
}

export function getCitiesByCountry(posts: PostWithAuthor[], country: string): string[] {
  const cities = new Set<string>()
  posts.forEach(post => {
    if (post.author.country === country && post.author.city) {
      cities.add(post.author.city)
    }
  })
  return Array.from(cities).sort()
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.ARTICLE]: 'Articles',
  [PostType.EVENT]: 'Events',
  [PostType.VACANCY]: 'Vacancies',
  [PostType.POLL]: 'Polls',
  [PostType.UPDATE]: 'Updates'
}

export function getEmptyStateMessage(filters: FeedFilters): string {
  const messages: Record<FeedView, string> = {
    featured: 'No featured posts available. Check back later for curated content!',
    all: 'No posts to display yet.',
    following: 'No posts from people you follow. Start following users to see their posts here!',
    saved: 'No saved posts yet. Bookmark posts you want to read later!'
  }

  let message = messages[filters.view]

  if (filters.postType) {
    message = `No ${POST_TYPE_LABELS[filters.postType].toLowerCase()} found with the current filters.`
  }

  if (filters.location.country) {
    const location = filters.location.city
      ? `${filters.location.city}, ${filters.location.country}`
      : filters.location.country
    message = `No posts from authors in ${location} with the current filters.`
  }

  return message
}
