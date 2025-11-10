import { Feed } from "../../../../shared-src/feed/Feed";
import { UserProfile } from "../types/profile";

interface PostsSectionProps {
  user: UserProfile;
  isOwnProfile: boolean;
}

export function PostsSection({ user, isOwnProfile }: PostsSectionProps) {
  return (
    <Feed
      filters={null}
      filterByUsername={user.username}
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
    />
  );
}
