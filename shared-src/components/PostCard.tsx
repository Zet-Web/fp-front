// Reusable post card component displaying a single post with author information

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share, MoreHorizontal, Bookmark } from "lucide-react"
import type { PostAuthor } from "../types/post"

interface PostCardProps {
  title: string
  content: string
  images: string[]
  author: PostAuthor
  showActions?: boolean
  onMoreClick?: () => void
  onBookmarkClick?: () => void
  onShareClick?: () => void
  isSaved?: boolean
}

export function PostCard({
  title,
  content,
  images,
  author,
  showActions = true,
  onMoreClick,
  onBookmarkClick,
  onShareClick,
  isSaved = false
}: PostCardProps) {
  const displayName = author.name || author.username || 'User'
  const displayUsername = author.username || author.telegram_username || 'user'
  const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={author.avatar_url || undefined} alt={displayName} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1">
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
              {showActions && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                    onClick={onMoreClick}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <h4 className="font-semibold text-base mb-3">{title}</h4>

            <p className="text-sm leading-relaxed mb-4">{content}</p>

            {images.length > 0 && (
              <div className="mb-4">
                <img
                  src={images[0]}
                  alt="Post content"
                  className="w-full rounded-lg object-cover max-h-64"
                />
              </div>
            )}

            {showActions && (
              <div className="flex justify-end gap-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onBookmarkClick?.()
                  }}
                >
                  <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onShareClick?.()
                  }}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
