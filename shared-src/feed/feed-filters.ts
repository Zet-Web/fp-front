// Feed filter utilities and logic for filtering posts

import {
  PostType,
  type PostWithAuthor,
  type FeedView,
  PostStatus,
} from "../post/post";

export enum PostStatusFilter {
  all = "all",
  draft = PostStatus.DRAFT,
  published = PostStatus.PUBLISHED,
  archived = PostStatus.ARCHIVED,
}

export interface FeedFilters {
  view: FeedView;
  postType?: PostType | null;
  location?: { country: string | null; city: string | null };
  status?: PostStatusFilter | null;
}

export const DEFAULT_FILTERS: FeedFilters = {
  view: "featured",
  postType: null,
  location: { country: null, city: null },
};

export function applyFeedFilters(
  posts: PostWithAuthor[],
  filters: FeedFilters,
  followedUserIds: string[]
): PostWithAuthor[] {
  let filtered = [...posts];

  switch (filters.view) {
    case "featured":
      filtered = filtered.filter((post) => post.is_featured);
      break;
    case "following":
      filtered = filtered.filter((post) =>
        followedUserIds.includes(post.author_id)
      );
      break;
    case "saved":
      filtered = filtered.filter((post) => post.is_saved === true);
      break;
    case "all":
    default:
      break;
  }

  if (filters.postType) {
    filtered = filtered.filter((post) => post.type === filters.postType);
  }

  if (filters.location?.country) {
    filtered = filtered.filter(
      (post) => post.author.country === filters.location?.country
    );

    if (filters.location?.city) {
      filtered = filtered.filter(
        (post) => post.author.city === filters.location?.city
      );
    }
  }

  return filtered;
}

export function getUniqueCountries(posts: PostWithAuthor[]): string[] {
  const countries = new Set<string>();
  posts.forEach((post) => {
    if (post.author.country) {
      countries.add(post.author.country);
    }
  });
  return Array.from(countries).sort();
}

export function getCitiesByCountry(
  posts: PostWithAuthor[],
  country: string
): string[] {
  const cities = new Set<string>();
  posts.forEach((post) => {
    if (post.author.country === country && post.author.city) {
      cities.add(post.author.city);
    }
  });
  return Array.from(cities).sort();
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.ARTICLE]: "Статьи",
  [PostType.EVENT]: "Мероприятия",
  [PostType.VACANCY]: "Вакансии",
  [PostType.QUIZ]: "Тесты",
};

export function getEmptyStateMessage(filters: FeedFilters): string {
  const messages: Record<FeedView, string> = {
    featured:
      "Нет рекомендованных публикаций. Попробуйте позже",
    all: "Нет публикаций",
    following:
      "Нет публикаций у людей, на которых вы подписаны",
    saved: "Нет сохраненных публикаций. Используйте иконку для сохранения публикации",
  };

  let message = messages[filters.view];

  if (filters.postType) {
    message = `No ${POST_TYPE_LABELS[
      filters.postType
    ].toLowerCase()} found with the current filters.`;
  }

  if (filters.location?.country) {
    const location = filters.location.city
      ? `${filters.location.city}, ${filters.location.country}`
      : filters.location.country;
    message = `No posts from authors in ${location} with the current filters.`;
  }

  return message;
}
