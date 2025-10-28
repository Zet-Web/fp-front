import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Feed } from "../../shared-src/components/Feed"
import { FeedFilters } from "../../shared-src/components/FeedFilters"
import { MOCK_POSTS, FOLLOWED_USER_IDS } from "../../shared-src/lib/mock-posts"
import { PostType } from "../../shared-src/types/post"
import {
  DEFAULT_FILTERS,
  applyFeedFilters,
  getUniqueCountries,
  getCitiesByCountry,
  getEmptyStateMessage,
  type FeedFilters as FeedFiltersType
} from "../../shared-src/lib/feed-filters"
import { useAuth } from "@/hooks/use-auth"

export function HomePage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [filters, setFilters] = useState<FeedFiltersType>(DEFAULT_FILTERS)

  const filteredPosts = useMemo(() => {
    return applyFeedFilters(MOCK_POSTS, filters, FOLLOWED_USER_IDS)
  }, [filters])

  const countries = useMemo(() => getUniqueCountries(MOCK_POSTS), [])
  const cities = useMemo(() => {
    return filters.location.country
      ? getCitiesByCountry(MOCK_POSTS, filters.location.country)
      : []
  }, [filters.location.country])

  const emptyMessage = getEmptyStateMessage(filters)

  const handleCreatePost = () => {
    if (session) {
      navigate('/post')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <FeedFilters
            view={filters.view}
            postType={filters.postType}
            location={filters.location}
            countries={countries}
            cities={cities}
            onViewChange={(view) => setFilters({ ...filters, view })}
            onPostTypeChange={(postType) => setFilters({ ...filters, postType })}
            onLocationChange={(location) => setFilters({ ...filters, location })}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Feed
            posts={filteredPosts}
            emptyMessage={emptyMessage}
            itemsPerPage={5}
            currentUserId={session?.user?.id}
          />
        </div>
      </div>

      <Button
        onClick={handleCreatePost}
        className="fixed bottom-20 md:bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}
