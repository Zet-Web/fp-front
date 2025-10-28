// Feed filters component with view tabs, post type toggles, and location dropdown

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, X } from "lucide-react"
import { PostType, type FeedView } from "../types/post"
import { POST_TYPE_LABELS } from "../lib/feed-filters"

interface FeedFiltersProps {
  view: FeedView
  postType: PostType | null
  location: { country: string | null; city: string | null }
  countries: string[]
  cities: string[]
  resultCount: number
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
  resultCount,
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
    <Card className="shadow-md mb-6">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Tabs value={view} onValueChange={(v) => onViewChange(v as FeedView)} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
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

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {resultCount} {resultCount === 1 ? 'post' : 'posts'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="text-xs font-medium text-muted-foreground mb-2">Post Type</div>
            <ToggleGroup
              type="single"
              value={postType || ''}
              onValueChange={(value) => onPostTypeChange(value ? (value as PostType) : null)}
              className="justify-start flex-wrap"
            >
              <ToggleGroupItem value={PostType.ARTICLE} className="text-xs">
                {POST_TYPE_LABELS[PostType.ARTICLE]}
              </ToggleGroupItem>
              <ToggleGroupItem value={PostType.EVENT} className="text-xs">
                {POST_TYPE_LABELS[PostType.EVENT]}
              </ToggleGroupItem>
              <ToggleGroupItem value={PostType.VACANCY} className="text-xs">
                {POST_TYPE_LABELS[PostType.VACANCY]}
              </ToggleGroupItem>
              <ToggleGroupItem value={PostType.POLL} className="text-xs">
                {POST_TYPE_LABELS[PostType.POLL]}
              </ToggleGroupItem>
              <ToggleGroupItem value={PostType.UPDATE} className="text-xs">
                {POST_TYPE_LABELS[PostType.UPDATE]}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="md:w-auto">
            <div className="text-xs font-medium text-muted-foreground mb-2">Location</div>
            <div className="flex gap-2">
              {location.country ? (
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="text-xs px-3 py-1.5">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location.city ? `${location.city}, ${location.country}` : location.country}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearLocation}
                    className="h-7 w-7 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      Filter by Location
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Select Country</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={location.country || ''} onValueChange={handleCountryChange}>
                      {countries.map((country) => (
                        <DropdownMenuRadioItem key={country} value={country}>
                          {country}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {location.country && cities.length > 0 && !location.city && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      Select City
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Cities in {location.country}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={location.city || ''} onValueChange={handleCityChange}>
                      {cities.map((city) => (
                        <DropdownMenuRadioItem key={city} value={city}>
                          {city}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
