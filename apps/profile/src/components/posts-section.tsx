import { useState } from "react";
import { Feed } from "../../../../shared-src/feed/Feed";
import {
  FeedFilters,
  PostStatusFilter,
} from "../../../../shared-src/feed/feed-filters";
import { UserProfile } from "../types/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostsSectionProps {
  user: UserProfile;
  isOwnProfile: boolean;
}

export function PostsSection({ user, isOwnProfile }: PostsSectionProps) {
  const [filters, setFilters] = useState<FeedFilters>({
    view: "all",
    status: PostStatusFilter.all,
  });

  const handleStatusChange = (value: PostStatusFilter) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {isOwnProfile && (
        <Select
          value={filters.status || undefined}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PostStatusFilter.all}>All</SelectItem>
            <SelectItem value={PostStatusFilter.published}>
              Published
            </SelectItem>
            <SelectItem value={PostStatusFilter.draft}>Drafts</SelectItem>
            <SelectItem value={PostStatusFilter.archived}>Archived</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Feed
        filters={filters}
        filterByUsername={user.username}
        emptyMessage={
          isOwnProfile
            ? "You haven't posted anything yet."
            : "No posts to show."
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
    </div>
  );
}
