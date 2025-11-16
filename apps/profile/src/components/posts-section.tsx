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
            <SelectItem value={PostStatusFilter.all}>Все</SelectItem>
            <SelectItem value={PostStatusFilter.published}>
              Опубликовано
            </SelectItem>
            <SelectItem value={PostStatusFilter.draft}>Черновики</SelectItem>
            <SelectItem value={PostStatusFilter.archived}>Архивировано</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Feed
        filters={filters}
        filterByUsername={user.username}
        emptyMessage={
          isOwnProfile
            ? "Публикаций нет"
            : "Публикаций нет"
        }
        emptyAction={
          isOwnProfile
            ? {
                label: "Создайте публикацию",
                onClick: () => console.log("Create post clicked"),
              }
            : undefined
        }
        itemsPerPage={10}
        showStatusBadges={isOwnProfile}
      />
    </div>
  );
}
