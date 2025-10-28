// Post page component for viewing, creating, and editing posts

import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "../../../shared-src/components/PostCard"
import { PostEditor, type PostEditorData } from "./components/PostEditor"
import { extractUrlCodeFromParam, isValidUrlCode, generateRandomUrlCode } from "../../../shared-src/lib/post-utils"
import { MOCK_POSTS } from "../../../shared-src/lib/mock-posts"
import type { PostWithAuthor } from "../../../shared-src/types/post"
import { PostType } from "../../../shared-src/types/post"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal } from "lucide-react"

export function PostPage() {
  const { urlCode } = useParams<{ urlCode: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [allPosts, setAllPosts] = useState<PostWithAuthor[]>(MOCK_POSTS)

  const isCreateMode = searchParams.get("mode") === "create"
  const isEditModeParam = searchParams.get("mode") === "edit"

  useEffect(() => {
    const loadPost = () => {
      setIsLoading(true)
      setError(null)

      if (isCreateMode) {
        setPost(null)
        setIsEditMode(true)
        setIsLoading(false)
        return
      }

      if (!urlCode) {
        setError("Invalid post URL")
        setIsLoading(false)
        return
      }

      const extractedCode = extractUrlCodeFromParam(urlCode)

      if (!isValidUrlCode(extractedCode)) {
        setError("Invalid post URL format")
        setIsLoading(false)
        return
      }

      const foundPost = allPosts.find(p => p.url === extractedCode)

      if (!foundPost) {
        setError("Post not found")
        setIsLoading(false)
        return
      }

      setPost(foundPost)
      setIsEditMode(isEditModeParam)
      setIsLoading(false)
    }

    loadPost()
  }, [urlCode, isCreateMode, isEditModeParam, allPosts])

  const handleSave = (data: PostEditorData) => {
    if (post) {
      const updatedPost = {
        ...post,
        ...data,
        updated_at: new Date().toISOString()
      }
      setAllPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p))
      setPost(updatedPost)
      setIsEditMode(false)
      toast.success("Post updated successfully")
    } else {
      const newPost: PostWithAuthor = {
        id: `post-${Date.now()}`,
        url: generateRandomUrlCode(),
        title: data.title,
        content: data.content,
        images: data.images,
        author_id: "test-user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: PostType.ARTICLE,
        is_featured: false,
        author: {
          id: "test-user-1",
          name: "John Doe",
          username: "johndoe",
          avatar_url: null,
          badge: ["verified"],
          telegram_username: "johndoe",
          city: "San Francisco",
          country: "USA"
        }
      }
      setAllPosts(prev => [newPost, ...prev])
      toast.success("Post created successfully")
      navigate(`/post/${newPost.url}`)
    }
  }

  const handleDelete = () => {
    if (post) {
      setAllPosts(prev => prev.filter(p => p.id !== post.id))
      toast.success("Post deleted successfully")
      navigate("/")
    }
    setShowDeleteDialog(false)
  }

  const handleCancel = () => {
    if (isCreateMode) {
      navigate("/")
    } else {
      setIsEditMode(false)
    }
  }

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

  if (error && !isCreateMode) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditMode || isCreateMode) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-6 py-6">
          <PostEditor
            post={post || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <PostCard
          postId={post.id}
          title={post.title}
          content={post.content}
          images={post.images}
          author={post.author}
          showActions={true}
          onMoreClick={() => {}}
        />

        <div className="flex justify-end mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
