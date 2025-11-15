import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostCard } from "../post/PostCard";
import { constructPostUrl } from "../post/post-utils";
import type { PostWithAuthor } from "../post/post";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPosts } from "../../shared-src/feed/api";
import { useAuthContext } from "@/components/auth-provider";
import { FeedFilters } from "./feed-filters";
import { FPApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

interface FeedProps {
  filters: FeedFilters | null;
  filterByUsername?: string | null;
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
  filterByUsername,
  emptyMessage = "Нет публикаций",
  emptyAction,
  itemsPerPage = 10,
}: FeedProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isAuthenticated } = useAuthContext();

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  const currentUserId = profile?.id || "";

  const requiresAuth = filters?.view === "following" || filters?.view === "saved";
  const shouldShowAuthPrompt = requiresAuth && !isAuthenticated;

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);
  }, [filters]);

  useEffect(() => {
    if (!hasMore) return;
    if (shouldShowAuthPrompt) {
      setIsInitialLoading(false);
      return;
    }

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
          itemsPerPage,
          filterByUsername
        );

        const existingIds = new Set(posts.map((p) => p.id));
        const uniqueNew = newPosts.filter((p) => !existingIds.has(p.id));

        if (uniqueNew.length === 0) {
          setHasMore(false);
          return;
        }

        setPosts((prev) => [...prev, ...uniqueNew]);

        if (typeof totalCount === "number") {
          const loadedSoFar = posts.length + uniqueNew.length;
          if (loadedSoFar >= totalCount) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } else {
          if (uniqueNew.length < itemsPerPage) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (err) {
        toast({
          title: "Failed to load posts",
          description: (err as Error).message || "",
        });
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
  }, [page, filters, itemsPerPage, hasMore, shouldShowAuthPrompt]);

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
            setPage((p) => p + 1);
          }
        },
        { root: null, rootMargin: "200px", threshold: 0.1 }
      );

      observerInstance.current.observe(node);
    },
    [isFetchingMore, isInitialLoading, hasMore]
  );

  const handleShareClick = async (post: PostWithAuthor) => {
    const url = `${window.location.origin}${constructPostUrl(post.url)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Ссылка скопирована",
      });
    } catch {
      toast({
        title: "Failed to copy",
      });
    }
  };

  const handleEditClick = (url: string) => {
    navigate(`/post/${url}?editMode=true`);
  };

  const handleDeletePost = async (postId: number) => {
    if (!postId) return;

    try {
      await FPApi.axios.delete(`/post/delete/${postId}`);
      toast({
        title: "Публикация удалена",
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      toast({
        title: "Delete post error",
        description: (error as Error)?.message || "Delete error",
      });
    }
  };

  if (shouldShowAuthPrompt) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {filters?.view === "following"
                ? "Посты контактов доступны после авторизации"
                : "Сохраненные посты доступны после авторизации"}
            </h3>
            <p className="text-muted-foreground text-sm">
              Войдите в систему, чтобы просматривать{" "}
              {filters?.view === "following"
                ? "посты ваших контактов"
                : "сохраненные публикации"}
            </p>
          </div>
          <Button onClick={() => navigate("/auth")} className="mt-4">
            <LogIn className="w-4 h-4 mr-2" />
            Войти
          </Button>
        </CardContent>
      </Card>
    );
  }

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
      {posts.map((post) => {
        const isOwner = currentUserId
          ? post.author_id === currentUserId
          : false;

        return (
          <Link key={post.id} to={constructPostUrl(post.url)} className="block">
            <PostCard
              postId={post.id}
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
              isPined={!!(filterByUsername && !!post.is_pinned)}
              showActions={true}
              isOwner={isOwner}
              onShareClick={() => handleShareClick(post)}
              onEditClick={() => handleEditClick(post.url)}
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
