import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostCard } from "../post/PostCard";
import { EditablePostCard } from "../post/EditablePostCard";
import { constructPostUrl } from "../post/post-utils";
import type { PostWithAuthor } from "../post/post";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchPosts } from "../../shared-src/lib/api";
import { FeedFilters } from "../lib/feed-filters";
import { useAuthContext } from "@/components/auth-provider";

interface FeedProps {
  filters: FeedFilters;
  filterByUserId?: string;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  itemsPerPage?: number;
}

function PostSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Feed({
  filters,
  filterByUserId,
  emptyMessage = "No posts to display",
  emptyAction,
  itemsPerPage = 10,
}: FeedProps) {
  // posts: массив постов (id: number)
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const { profile } = useAuthContext();
  const currentUserId = profile?.id || "";

  // observer ref and instance
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  // when filters change — reset feed to first page
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);
  }, [filters]);

  // load posts when page changes (or filters/itemsPerPage)
  useEffect(() => {
    if (!hasMore) return;

    const controller = new AbortController();

    const load = async () => {
      if (page === 1) {
        setIsInitialLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const { posts: newPosts = [], count: totalCount } = await fetchPosts(
          filters,
          page,
          itemsPerPage
        );

        // Dedupe: не добавляем посты с id, которые уже есть
        const existingIds = new Set(posts.map((p) => p.id));
        const uniqueNew = newPosts.filter((p) => !existingIds.has(p.id));

        // Если пришло 0 уникальных — возможно бэкенд возвращает дубликаты; завершаем загрузку
        if (uniqueNew.length === 0) {
          // если при первой загрузке вообще ничего не пришло, оставляем posts пустым
          setHasMore(false);
          return;
        }

        setPosts((prev) => [...prev, ...uniqueNew]);

        // если известен общий count (totalCount) — можно определить hasMore точно
        if (typeof totalCount === "number") {
          const loadedSoFar = posts.length + uniqueNew.length;
          if (loadedSoFar >= totalCount) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } else {
          // fallback: если пришло меньше чем itemsPerPage -> конец
          if (uniqueNew.length < itemsPerPage) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (err) {
        // abort === нормально при смене страницы/фильтра; прочие ошибки — показать сообщение
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to fetch posts:", err);
          toast.error("Failed to load posts");
        }
      } finally {
        setIsInitialLoading(false);
        setIsFetchingMore(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, itemsPerPage, hasMore]); // posts intentionally omitted to avoid refetch loop

  // IntersectionObserver setup via callback ref (cleaner + stable)
  const attachObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerInstance.current) {
        observerInstance.current.disconnect();
        observerInstance.current = null;
      }

      if (!node) return;

      observerRef.current = node;
      observerInstance.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (
            entry.isIntersecting &&
            !isFetchingMore &&
            !isInitialLoading &&
            hasMore
          ) {
            // увеличиваем страницу (это триггерит эффект загрузки)
            setPage((p) => p + 1);
          }
        },
        { root: null, rootMargin: "200px", threshold: 0.1 }
      );

      observerInstance.current.observe(node);
    },
    [isFetchingMore, isInitialLoading, hasMore]
  );

  // filtered posts (по user)
  const filteredPosts = filterByUserId
    ? posts.filter((p) => p.author_id === filterByUserId)
    : posts;

  // HANDLERS
  const handleBookmarkClick = (id: number) => {
    // обновляем поле is_saved внутри posts — это гарантирует, что PostCard увидит изменение
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_saved: !p.is_saved } : p))
    );
  };

  const handleShareClick = async (post: PostWithAuthor) => {
    const url = `${window.location.origin}${constructPostUrl(post.url)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleEditClick = (id: number) => setEditingPostId(id);
  const handleCancelEdit = () => setEditingPostId(null);

  const handleSavePost = (id: number, updates: Partial<PostWithAuthor>) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updated_at: new Date().toISOString() }
          : p
      )
    );
    setEditingPostId(null);
    toast.success("Post updated");
  };

  const handleDeletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post deleted");
  };

  // RENDERING
  if (isInitialLoading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">{emptyMessage}</p>
          {emptyAction && (
            <Button variant="outline" onClick={emptyAction.onClick}>
              {emptyAction.label}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {filteredPosts.map((post) => {
        const isEditing = editingPostId === post.id;
        const isOwner = currentUserId
          ? post.author_id === currentUserId
          : false;

        if (isEditing) {
          return (
            <EditablePostCard
              key={post.id}
              {...post}
              onSave={(updates) => handleSavePost(post.id, updates)}
              onCancel={handleCancelEdit}
            />
          );
        }

        return (
          <Link key={post.id} to={constructPostUrl(post.url)} className="block">
            <PostCard
              title={post.title || ""}
              content={post.excerpt || ""}
              images={
                post.cover_image
                  ? [post.cover_image, ...(post.images ?? [])]
                  : Array.isArray(post.images)
                  ? post.images
                  : []
              }
              author={post.author}
              isSaved={!!post.is_saved}
              showActions={true}
              isOwner={isOwner}
              onBookmarkClick={() => handleBookmarkClick(post.id)}
              onShareClick={() => handleShareClick(post)}
              onEditClick={() => handleEditClick(post.id)}
              onDeleteClick={() => handleDeletePost(post.id)}
            />
          </Link>
        );
      })}

      {hasMore && (
        <div ref={attachObserver} className="py-4">
          <PostSkeleton />
        </div>
      )}
    </div>
  );
}
