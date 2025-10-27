import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share, MoreHorizontal, Bookmark, FileText } from "lucide-react"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { VerifiedBadge } from "@/components/shared/VerifiedBadge"
import { EmptyState } from "@/components/shared/EmptyState"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
  contact_info: any[] | null
}

interface PostsSectionProps {
  user: UserProfile
  isOwnProfile: boolean
}

const posts = [
  {
    id: 1,
    title: "New E-Commerce Platform Launch",
    content: "Just finished building a new e-commerce platform with React and Node.js! The performance improvements are incredible - 40% faster load times and seamless user experience. Excited to share more details soon! 🚀",
    images: ["https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
  },
  {
    id: 2,
    title: "React Conference 2024 Experience",
    content: "Attending the React Conference 2024 was an amazing experience! Met so many talented developers and learned about the latest trends in web development. The future of React looks incredibly promising with the new concurrent features.",
    images: ["https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
  },
  {
    id: 3,
    title: "Open Source TypeScript Project",
    content: "Working on a new open-source project that helps developers optimize their TypeScript configurations. It's been a challenging but rewarding journey. Looking for contributors who are passionate about developer tooling!",
    images: [],
  },
  {
    id: 4,
    title: "AWS and Docker Deployment Success",
    content: "Just deployed my latest project using AWS and Docker. The scalability and performance are exactly what I was hoping for. Here's a quick overview of the architecture and deployment process.",
    images: ["https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
  }
]

export function PostsSection({ user, isOwnProfile }: PostsSectionProps) {
  const displayName = user.name || user.username || 'User'
  const displayUsername = user.username || user.telegram_username || 'user'
  const avatarFallback = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="space-y-6">
      {isOwnProfile && posts.length === 0 && (
        <EmptyState
          message="You haven't posted anything yet."
          icon={FileText}
          actionButton={<Button variant="outline">Create your first post</Button>}
        />
      )}

      {!isOwnProfile && posts.length === 0 && (
        <EmptyState
          message="No posts to show."
          icon={FileText}
        />
      )}
      
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <UserAvatar
                  src={user.avatar_url}
                  alt={displayName}
                  fallback={avatarFallback}
                  size="md"
                />
              </div>
              
              {/* Content on the right */}
              <div className="flex-1 min-w-0">
                {/* Header with name and action buttons */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-sm">{displayName}</h3>
                    <VerifiedBadge isVerified={user.badge?.includes('verified')} size="sm" />
                    <span className="text-sm text-muted-foreground">@{displayUsername}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Post title */}
                <h4 className="font-semibold text-base mb-3">{post.title}</h4>
                
                {/* Post content */}
                <p className="text-sm leading-relaxed mb-4">{post.content}</p>
            
              {post.images.length > 0 && (
                <div className="mb-4">
                  <img 
                    src={post.images[0]} 
                    alt="Post content"
                    className="w-full rounded-lg object-cover max-h-64"
                  />
                </div>
              )}
                
                {/* Action buttons at bottom right */}
                <div className="flex justify-end gap-1 mt-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}