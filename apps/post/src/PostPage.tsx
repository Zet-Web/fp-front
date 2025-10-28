// Individual post page component displaying a single post by URL code or creating a new post

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "../../../shared-src/components/PostCard"
import { EditablePostCard } from "../../../shared-src/components/EditablePostCard"
import { extractUrlCodeFromParam, isValidUrlCode } from "../../../shared-src/lib/post-utils"
import { MOCK_POSTS } from "../../../shared-src/lib/mock-posts"
import { PostType, PostStatus } from "../../../shared-src/types/post"
import type { PostWithAuthor } from "../../../shared-src/types/post"

export function PostPage() {
  const { urlCode } = useParams<{ urlCode: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)

  const currentUserId = "mock-user-id"

  useEffect(() => {
    const loadPost = () => {
      setIsLoading(true)
      setError(null)

      if (!urlCode) {
        setIsCreateMode(true)
        setIsEditing(true)
        setPost({
          id: crypto.randomUUID(),
          title: '',
          excerpt: '',
          content: '',
          cover_image: undefined,
          images: [],
          type: PostType.ARTICLE,
          status: PostStatus.DRAFT,
          is_pinned: false,
          url: '',
          slug: undefined,
          author: {
            id: currentUserId,
            name: "Current User",
            username: "currentuser",
            telegram_username: null,
            avatar_url: null,
            badge: null
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        setIsLoading(false)
        return
      }

      const extractedCode = extractUrlCodeFromParam(urlCode)

      if (!isValidUrlCode(extractedCode)) {
        setError("Invalid post URL format")
        setIsLoading(false)
        return
      }

      const foundPost = MOCK_POSTS.find(p => p.url === extractedCode)

      if (!foundPost) {
        setError("Post not found")
        setIsLoading(false)
        return
      }

      setPost(foundPost)
      setIsCreateMode(false)
      setIsEditing(false)
      setIsLoading(false)
    }

    loadPost()
  }, [urlCode])

  const handleSave = (updates: any) => {
    if (!post) return

    const updatedPost = {
      ...post,
      ...updates,
      updated_at: new Date().toISOString()
    }

    if (isCreateMode) {
      const newUrlCode = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      updatedPost.url = newUrlCode
      MOCK_POSTS.unshift(updatedPost)
      console.log('New post created:', updatedPost)
      navigate(`/post/${newUrlCode}`)
    } else {
      const postIndex = MOCK_POSTS.findIndex(p => p.id === post.id)
      if (postIndex !== -1) {
        MOCK_POSTS[postIndex] = updatedPost
        console.log('Post updated:', updatedPost)
      }
      setPost(updatedPost)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (isCreateMode) {
      navigate("/")
    } else {
      setIsEditing(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleDelete = () => {
    if (!post) return
    const postIndex = MOCK_POSTS.findIndex(p => p.id === post.id)
    if (postIndex !== -1) {
      MOCK_POSTS.splice(postIndex, 1)
      console.log('Post deleted')
    }
    navigate("/")
  }

  const isOwner = post?.author.id === currentUserId

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error || "Post not found"}</p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        {isEditing ? (
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
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <PostCard
            title={post.title}
            content={post.excerpt}
            images={post.cover_image ? [post.cover_image, ...post.images] : post.images}
            author={post.author}
            showActions={true}
            isOwner={isOwner}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
