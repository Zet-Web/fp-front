// Editable post card component for inline post editing

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { useState } from "react"
import type { PostAuthor } from "../types/post"

interface EditablePostCardProps {
  title: string
  content: string
  images: string[]
  author: PostAuthor
  onSave: (updates: { title: string; content: string; images: string[] }) => void
  onCancel: () => void
}

export function EditablePostCard({
  title,
  content,
  images,
  author,
  onSave,
  onCancel
}: EditablePostCardProps) {
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedContent, setEditedContent] = useState(content)
  const [editedImages, setEditedImages] = useState(images)

  const displayName = author.name || author.username || 'User'
  const displayUsername = author.username || author.telegram_username || 'user'
  const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleSave = () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      return
    }
    onSave({
      title: editedTitle.trim(),
      content: editedContent.trim(),
      images: editedImages
    })
  }

  const removeImage = (index: number) => {
    setEditedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="shadow-md border-2 border-primary/20">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={author.avatar_url || undefined} alt={displayName} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-3">
              <h3 className="font-semibold text-sm">{displayName}</h3>
              {author.badge?.includes('verified') && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className="text-sm text-muted-foreground">@{displayUsername}</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-sm font-medium mb-2 block">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Post title"
                  className="font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="edit-content" className="text-sm font-medium mb-2 block">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Post content"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {editedImages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Images</Label>
                  <div className="space-y-2">
                    {editedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full rounded-lg object-cover max-h-64"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={!editedTitle.trim() || !editedContent.trim()}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
