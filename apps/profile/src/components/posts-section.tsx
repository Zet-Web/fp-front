import { Feed } from "../../../../shared-src/components/Feed";
import { MOCK_POSTS } from "../../../../shared-src/lib/mock-posts";
import { UserProfile } from "../types/profile";

interface PostsSectionProps {
  user: UserProfile;
  isOwnProfile: boolean;
}

export function PostsSection({ user, isOwnProfile }: PostsSectionProps) {
  return (
    <Feed
      posts={MOCK_POSTS}
      filterByUserId={user.id}
      emptyMessage={
        isOwnProfile ? "You haven't posted anything yet." : "No posts to show."
      }
      emptyAction={
        isOwnProfile
          ? {
              label: "Create your first post",
              onClick: () => console.log("Create post clicked"),
            }
          : undefined
      }
      itemsPerPage={10}
      currentUserId={user.id}
    />
  );
}
