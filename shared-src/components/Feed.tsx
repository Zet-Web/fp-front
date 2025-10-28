import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { PostCard } from "./PostCard"
import type { PostWithAuthor } from "../types/post"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface FeedProps {
  posts: PostWithAuthor[]
  filterByUserId?: string
  emptyMessage?: string
  emptyAction?: {
    label: string
    onClick: () => void
  }
  itemsPerPage?: number
  currentUserId?: string
  onPostDeleted?: (postId: string) => void
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
  currentUserId,
  onPostDeleted
}: FeedProps) {
  const navigate = useNavigate()
  const [displayedPosts, setDisplayedPosts] = useState<PostWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<PostWithAuthor | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
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
    const postUrl = `${window.location.origin}/post/${post.id}`

    try {
      await navigator.clipboard.writeText(postUrl)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleEditClick = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  const handleDeleteClick = (post: PostWithAuthor) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-post?id=${postToDelete.id}`
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      toast.success('Post deleted successfully')
      setDeleteDialogOpen(false)
      setPostToDelete(null)

      setDisplayedPosts(prev => prev.filter(p => p.id !== postToDelete.id))

      if (onPostDeleted) {
        onPostDeleted(postToDelete.id)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
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
    <>
      <div className="space-y-6">
        {displayedPosts.map((post) => {
          const isOwner = currentUserId && post.author_id === currentUserId
          return (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              images={post.images}
              author={post.author}
              showActions={true}
              isSaved={savedPostIds.has(post.id)}
              isOwner={isOwner}
              onEditClick={() => handleEditClick(post.id)}
              onDeleteClick={() => handleDeleteClick(post)}
              onBookmarkClick={() => handleBookmarkClick(post.id)}
              onShareClick={() => handleShareClick(post)}
            />
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
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
