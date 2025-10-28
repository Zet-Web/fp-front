// Posts section component displaying user posts with Feed component

import { Feed } from "../../../../shared-src/components/Feed"
import { MOCK_POSTS } from "../../../../shared-src/lib/mock-posts"

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

export function PostsSection({ user, isOwnProfile }: PostsSectionProps) {
  return (
    <Feed
      posts={MOCK_POSTS}
      filterByUserId={user.id}
      emptyMessage={
        isOwnProfile
          ? "You haven't posted anything yet."
          : "No posts to show."
      }
      emptyAction={
        isOwnProfile
          ? {
              label: "Create your first post",
              onClick: () => console.log("Create post clicked")
            }
          : undefined
      }
      itemsPerPage={10}
    />
  )
}
