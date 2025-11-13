import { FPApi } from "@/lib/api";
import { FeedFilters } from "./feed-filters";
import { PostWithAuthor } from "../post/post";

export type FetchPostResponse = {
    posts: PostWithAuthor[]; count: number;
}

export async function fetchPosts(filters: FeedFilters | null, page: number, itemsPerPage: number, filterByUsername?: string | null): Promise<FetchPostResponse> {
  const params = new URLSearchParams(filters ? {
    limit: itemsPerPage.toString(),
    offset: ((page - 1) * itemsPerPage).toString(),
    view: filters.view,
  } : {});

  if (filters?.postType) params.set("postType", filters.postType);
  if (filters?.status) params.set("status", filters.status);
  if (filterByUsername) params.set("username", filterByUsername);

  if (filters?.location?.country) params.set("country", filters.location.country);
  if (filters?.location?.city) params.set("city", filters.location.city);

  const res = await FPApi.axios.get<FetchPostResponse>(`/post/search?${params.toString()}`);
  return res.data
}