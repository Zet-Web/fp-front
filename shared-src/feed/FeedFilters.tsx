// Compact feed filters with view tabs and dropdown filters for type and location

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostType, type FeedView } from "../post/post";
import { POST_TYPE_LABELS } from "./feed-filters";
import { FeedLocationDropdown } from "./FeedLocationDropdown";
import { useAuthContext } from "../../src/components/auth-provider";

interface FeedFiltersProps {
  view: FeedView;
  postType: PostType | null;
  location: { country: string | null; city: string | null };
  countries: string[];
  cities: string[];
  onViewChange: (view: FeedView) => void;
  onPostTypeChange: (type: PostType | null) => void;
  onLocationChange: (location: {
    country: string | null;
    city: string | null;
  }) => void;
}

export function FeedFilters({
  view,
  postType,
  location,
  countries,
  cities,
  onViewChange,
  onPostTypeChange,
  onLocationChange,
}: FeedFiltersProps) {
  const handleCountryChange = (country: string) => {
    onLocationChange({ country, city: null });
  };

  const handleCityChange = (city: string) => {
    onLocationChange({ ...location, city });
  };

  const clearLocation = () => {
    onLocationChange({ country: null, city: null });
  };

  return (
    <Card className="shadow-sm border-b">
      <CardContent className="p-3 space-y-3">
        <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
          <Tabs value={view} onValueChange={(v) => onViewChange(v as FeedView)}>
            {/* <TabsList className="grid w-full grid-cols-4 h-9 min-w-max md:min-w-0"> */}
            <TabsList className="grid w-full grid-cols-3 h-9 min-w-max md:min-w-0">
              <TabsTrigger value="featured" className="text-sm">
                Рекомендовано
              </TabsTrigger>
              {/* Temporary hidden */}
              {/* <TabsTrigger value="all" className="text-sm">
                Все посты
              </TabsTrigger> */}
              <TabsTrigger value="following" className="text-sm">
                Посты контактов
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-sm">
                Сохранено
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex gap-2 md:gap-3">
          <div className="flex-1 md:flex-none md:w-auto">
            <Select
              value={postType || "all"}
              onValueChange={(value) =>
                onPostTypeChange(value === "all" ? null : (value as PostType))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value={PostType.ARTICLE}>
                  {POST_TYPE_LABELS[PostType.ARTICLE]}
                </SelectItem>
                <SelectItem value={PostType.EVENT}>
                  {POST_TYPE_LABELS[PostType.EVENT]}
                </SelectItem>
                <SelectItem value={PostType.VACANCY}>
                  {POST_TYPE_LABELS[PostType.VACANCY]}
                </SelectItem>
                <SelectItem value={PostType.QUIZ}>
                  {POST_TYPE_LABELS[PostType.QUIZ]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TEMPORARILY HIDDEN: Location selector */}
          {/* <div className="flex-1">
            <FeedLocationDropdown
              country={location.country}
              city={location.city}
              countries={countries}
              cities={cities}
              onCountryChange={handleCountryChange}
              onCityChange={handleCityChange}
              onClear={clearLocation}
            />
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
