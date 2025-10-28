import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share, MoreHorizontal, Bookmark, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { PostAuthor } from "../types/post"

interface PostCardProps {
  id?: string
  title: string
  content: string
  images: string[]
  author: PostAuthor
  showActions?: boolean
  onEditClick?: () => void
  onDeleteClick?: () => void
  onBookmarkClick?: () => void
  onShareClick?: () => void
  isSaved?: boolean
  isOwner?: boolean
}

export function PostCard({
  id,
  title,
  content,
  images,
  author,
  showActions = true,
  onEditClick,
  onDeleteClick,
  onBookmarkClick,
  onShareClick,
  isSaved = false,
  isOwner = false
}: PostCardProps) {
  const navigate = useNavigate()
  const displayName = author.name || author.username || 'User'
  const displayUsername = author.username || author.telegram_username || 'user'
  const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (author.username) {
      navigate(`/${author.username}`)
    }
  }

  const handlePostClick = () => {
    if (id) {
      navigate(`/post/${id}`)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar
              className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAuthorClick}
            >
              <AvatarImage src={author.avatar_url || undefined} alt={displayName} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAuthorClick}
              >
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
              {showActions && isOwner && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        onEditClick?.()
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteClick?.()
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <div className="cursor-pointer" onClick={handlePostClick}>
              <h4 className="font-semibold text-base mb-3 hover:text-blue-500 transition-colors">{title}</h4>

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
            </div>

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
