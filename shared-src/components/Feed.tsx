// Feed component with filtering, sorting, lazy loading and skeleton states

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "./PostCard"
import { constructPostUrl } from "../lib/post-utils"
import type { PostWithAuthor } from "../types/post"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FeedProps {
  posts: PostWithAuthor[]
  filterByUserId?: string
  emptyMessage?: string
  emptyAction?: {
    label: string
    onClick: () => void
  }
  itemsPerPage?: number
  onPostUpdate?: (postId: string, post: PostWithAuthor) => void
  onPostDelete?: (postId: string) => void
  showEditDelete?: boolean
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
  )
}

export function Feed({
  posts,
  filterByUserId,
  emptyMessage = "No posts to display",
  emptyAction,
  itemsPerPage = 10,
  onPostUpdate,
  onPostDelete,
  showEditDelete = false
}: FeedProps) {
  const navigate = useNavigate()
  const [displayedPosts, setDisplayedPosts] = useState<PostWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  const filteredPosts = filterByUserId
    ? posts.filter(post => post.author_id === filterByUserId)
    : posts

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const loadMorePosts = useCallback(() => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = page * itemsPerPage
    const newPosts = sortedPosts.slice(startIndex, endIndex)

    if (newPosts.length > 0) {
      setDisplayedPosts(prev => [...prev, ...newPosts])
      setPage(prev => prev + 1)

      if (endIndex >= sortedPosts.length) {
        setHasMore(false)
      }
    } else {
      setHasMore(false)
    }
  }, [page, sortedPosts, itemsPerPage])

  useEffect(() => {
    setIsLoading(true)
    setPage(1)
    const timer = setTimeout(() => {
      const initialPosts = sortedPosts.slice(0, itemsPerPage)
      setDisplayedPosts(initialPosts)
      setHasMore(sortedPosts.length > itemsPerPage)
      setIsLoading(false)

      const initialSavedIds = new Set(sortedPosts.filter(p => p.is_saved).map(p => p.id))
      setSavedPostIds(initialSavedIds)
    }, 500)

    return () => clearTimeout(timer)
  }, [sortedPosts, itemsPerPage])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasMore, isLoading, loadMorePosts])

  const handleBookmarkClick = (postId: string) => {
    setSavedPostIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
        toast.success('Post removed from saved')
      } else {
        newSet.add(postId)
        toast.success('Post saved')
      }
      return newSet
    })
  }

  const handleShareClick = async (post: PostWithAuthor) => {
    const postUrl = `${window.location.origin}${constructPostUrl(post.url, post.slug)}`

    try {
      await navigator.clipboard.writeText(postUrl)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleEditClick = (post: PostWithAuthor) => {
    navigate(`/post/${post.url}?mode=edit`)
  }

  const handleDeleteClick = (postId: string) => {
    setDeletePostId(postId)
  }

  const confirmDelete = () => {
    if (deletePostId) {
      onPostDelete?.(deletePostId)
      toast.success('Post deleted successfully')
      setDeletePostId(null)
    }
  }

  if (isLoading && displayedPosts.length === 0) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (displayedPosts.length === 0) {
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
    )
  }

  return (
    <div className="space-y-6">
      {displayedPosts.map((post) => {
        const postUrl = constructPostUrl(post.url, post.slug)
        return (
          <div key={post.id}>
            <PostCard
              postId={post.id}
              postUrl={postUrl}
              title={post.title}
              content={post.content}
              images={post.images}
              author={post.author}
              showActions={true}
              showEditDelete={showEditDelete}
              isSaved={savedPostIds.has(post.id)}
              onEditClick={() => handleEditClick(post)}
              onDeleteClick={() => handleDeleteClick(post.id)}
              onBookmarkClick={() => handleBookmarkClick(post.id)}
              onShareClick={() => handleShareClick(post)}
              onContentClick={() => window.location.href = postUrl}
            />
          </div>
        )
      })}

      {hasMore && (
        <div ref={observerRef} className="py-4">
          <PostSkeleton />
        </div>
      )}

      {!hasMore && displayedPosts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">You've reached the end</p>
        </div>
      )}

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
