// Post editor component for creating and editing posts

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { PostWithAuthor } from "../../../../shared-src/types/post"

interface PostEditorProps {
  post?: PostWithAuthor
  onSave: (data: PostEditorData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface PostEditorData {
  title: string
  content: string
  images: string[]
}

export function PostEditor({ post, onSave, onCancel, isLoading = false }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [imageUrl, setImageUrl] = useState("")
  const [images, setImages] = useState<string[]>(post?.images || [])

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      return
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      images
    })
  }

  const isValid = title.trim() && content.trim()

  return (
    <Card className="max-w-4xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>{post ? "Edit Post" : "Create Post"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows={8}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Cover Image (URL)</Label>
          <div className="flex gap-2">
            <Input
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={handleAddImage}
              disabled={!imageUrl.trim() || isLoading}
            >
              Add
            </Button>
          </div>
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="space-y-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full rounded-lg object-cover max-h-64"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Saving..." : post ? "Update" : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
