// Feed component with filtering, sorting, lazy loading and skeleton states

import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "./PostCard"
import { EditablePostCard } from "./EditablePostCard"
import { constructPostUrl } from "../lib/post-utils"
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
  currentUserId
}: FeedProps) {
  const [displayedPosts, setDisplayedPosts] = useState<PostWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [localPosts, setLocalPosts] = useState<PostWithAuthor[]>(posts)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalPosts(posts)
  }, [posts])

  const filteredPosts = filterByUserId
    ? localPosts.filter(post => post.author_id === filterByUserId)
    : localPosts

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

  const handleEditClick = (postId: string) => {
    setEditingPostId(postId)
  }

  const handleSavePost = (postId: string, updates: {
    title?: string
    excerpt: string
    content?: string
    cover_image?: string
    images: string[]
    type: any
    status: any
    is_pinned: boolean
    slug?: string
  }) => {
    setLocalPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, ...updates, updated_at: new Date().toISOString() }
        : post
    ))
    setEditingPostId(null)
    toast.success('Post updated successfully')
  }

  const handleCancelEdit = () => {
    setEditingPostId(null)
  }

  const handleDeletePost = (postId: string) => {
    setLocalPosts(prev => prev.filter(post => post.id !== postId))
    toast.success('Post deleted successfully')
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
        const isEditing = editingPostId === post.id
        const isOwner = currentUserId ? post.author_id === currentUserId : true

        if (isEditing) {
          return (
            <div key={post.id}>
              <EditablePostCard
                title={post.title}
                excerpt={post.excerpt}
                content={post.content}
                coverImage={post.cover_image}
                images={post.images}
                type={post.type}
                status={post.status}
                isPinned={post.is_pinned}
                slug={post.slug}
                author={post.author}
                onSave={(updates) => handleSavePost(post.id, updates)}
                onCancel={handleCancelEdit}
              />
            </div>
          )
        }

        return (
          <Link
            key={post.id}
            to={constructPostUrl(post.url, post.slug)}
            className="block"
          >
            <PostCard
              title={post.title}
              content={post.content}
              images={post.images}
              author={post.author}
              showActions={true}
              isSaved={savedPostIds.has(post.id)}
              isOwner={isOwner}
              onBookmarkClick={() => handleBookmarkClick(post.id)}
              onShareClick={() => handleShareClick(post)}
              onEditClick={() => handleEditClick(post.id)}
              onDeleteClick={() => handleDeletePost(post.id)}
            />
          </Link>
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
  )
}
