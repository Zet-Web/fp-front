// Compact feed filters with view tabs and dropdown filters for type and location

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PostType, type FeedView } from "../types/post"
import { POST_TYPE_LABELS } from "../lib/feed-filters"
import { FeedLocationDropdown } from "./FeedLocationDropdown"

interface FeedFiltersProps {
  view: FeedView
  postType: PostType | null
  location: { country: string | null; city: string | null }
  countries: string[]
  cities: string[]
  onViewChange: (view: FeedView) => void
  onPostTypeChange: (type: PostType | null) => void
  onLocationChange: (location: { country: string | null; city: string | null }) => void
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
    onLocationChange({ country, city: null })
  }

  const handleCityChange = (city: string) => {
    onLocationChange({ ...location, city })
  }

  const clearLocation = () => {
    onLocationChange({ country: null, city: null })
  }

  return (
    <Card className="shadow-sm border-b">
      <CardContent className="p-3 space-y-3">
        <Tabs value={view} onValueChange={(v) => onViewChange(v as FeedView)}>
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="featured" className="text-sm">
              Featured
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="following" className="text-sm">
              Following
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-sm">
              Saved
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="w-full md:w-32">
            <Select
              value={postType || 'all'}
              onValueChange={(value) => onPostTypeChange(value === 'all' ? null : (value as PostType))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={PostType.ARTICLE}>{POST_TYPE_LABELS[PostType.ARTICLE]}</SelectItem>
                <SelectItem value={PostType.EVENT}>{POST_TYPE_LABELS[PostType.EVENT]}</SelectItem>
                <SelectItem value={PostType.VACANCY}>{POST_TYPE_LABELS[PostType.VACANCY]}</SelectItem>
                <SelectItem value={PostType.POLL}>{POST_TYPE_LABELS[PostType.POLL]}</SelectItem>
                <SelectItem value={PostType.UPDATE}>{POST_TYPE_LABELS[PostType.UPDATE]}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <FeedLocationDropdown
              country={location.country}
              city={location.city}
              countries={countries}
              cities={cities}
              onCountryChange={handleCountryChange}
              onCityChange={handleCityChange}
              onClear={clearLocation}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
