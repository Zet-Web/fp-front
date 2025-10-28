import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostCard } from "../../../shared-src/components/PostCard"
import { PostType } from "../../../shared-src/types/post"
import type { PostWithAuthor } from "../../../shared-src/types/post"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"

export function PostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { session } = useAuth()
  const { toast } = useToast()

  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: PostType.ARTICLE,
    slug: '',
    images: [] as string[],
  })

  const isCreateMode = !id

  useEffect(() => {
    if (isCreateMode) {
      setIsEditing(true)
      return
    }

    const loadPost = async () => {
      setIsLoading(true)
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-post?id=${id}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error('Failed to load post')
        }

        const data = await response.json()
        setPost(data)
        setFormData({
          title: data.title,
          content: data.content,
          type: data.type,
          slug: data.slug || '',
          images: data.images || [],
        })
      } catch (error) {
        console.error('Error loading post:', error)
        toast({
          title: "Error",
          description: "Failed to load post",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [id, isCreateMode, toast])

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    if (!session?.access_token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create or edit posts",
        variant: "destructive",
      })
      navigate('/auth')
      return
    }

    setIsSaving(true)
    try {
      const endpoint = isCreateMode ? 'create-post' : 'update-post'
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`

      const body = isCreateMode
        ? formData
        : { ...formData, id: post?.id }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      const savedPost = await response.json()

      toast({
        title: "Success",
        description: isCreateMode ? "Post created successfully" : "Post updated successfully",
      })

      if (isCreateMode) {
        navigate(`/post/${savedPost.id}`)
      } else {
        setPost(savedPost)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (isCreateMode) {
      navigate(-1)
    } else {
      setIsEditing(false)
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          type: post.type,
          slug: post.slug || '',
          images: post.images || [],
        })
      }
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

  if (isEditing) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {isCreateMode ? 'Create Post' : 'Edit Post'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter post content"
                    rows={10}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Post Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as PostType })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PostType.ARTICLE}>Article</SelectItem>
                      <SelectItem value={PostType.EVENT}>Event</SelectItem>
                      <SelectItem value={PostType.VACANCY}>Vacancy</SelectItem>
                      <SelectItem value={PostType.POLL}>Poll</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="slug">Slug (optional)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="custom-url-slug"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="images">Image URL (optional)</Label>
                  <Input
                    id="images"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Post'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">Post not found</p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="mb-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {session && post.author.id === session.user?.id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Post
            </Button>
          )}
        </div>

        <PostCard
          title={post.title}
          content={post.content}
          images={post.images}
          author={post.author}
          showActions={true}
        />
      </div>
    </div>
  )
}
