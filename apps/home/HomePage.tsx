// Home page with feed of posts from the network

import { useState, useMemo } from "react";
import { Feed } from "../../shared-src/components/Feed";
import { FeedFilters } from "../../shared-src/components/FeedFilters";
import { MOCK_POSTS } from "../../shared-src/lib/mock-posts";
import {
  DEFAULT_FILTERS,
  getUniqueCountries,
  getCitiesByCountry,
  getEmptyStateMessage,
  type FeedFilters as FeedFiltersType,
} from "../../shared-src/lib/feed-filters";

export function HomePage() {
  const [filters, setFilters] = useState<FeedFiltersType>(DEFAULT_FILTERS);

  const countries = useMemo(() => getUniqueCountries(MOCK_POSTS), []);
  const cities = useMemo(() => {
    return filters.location.country
      ? getCitiesByCountry(MOCK_POSTS, filters.location.country)
      : [];
  }, [filters.location.country]);

  const emptyMessage = getEmptyStateMessage(filters);

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
            onPostTypeChange={(postType) =>
              setFilters({ ...filters, postType })
            }
            onLocationChange={(location) =>
              setFilters({ ...filters, location })
            }
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Feed
            filters={filters}
            emptyMessage={emptyMessage}
            itemsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
}
