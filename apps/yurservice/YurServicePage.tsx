// YurService page with database-driven resource catalog

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, AlertCircle } from "lucide-react"
import { ResourceCard } from "./components/ResourceCard"
import { RegionSelect } from "./components/RegionSelect"
import { useYurServiceData } from "./hooks/use-yurservice-data"
import { mapDatabaseResourceToUI } from "./lib/resource-mapper"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ITEMS_PER_PAGE = 18

export function YurServicePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all")
  const [courtPage, setCourtPage] = useState(1)
  const [govPage, setGovPage] = useState(1)
  const [toolPage, setToolPage] = useState(1)

  const { resources, regions, isLoading, error } = useYurServiceData()

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.about && resource.about.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRegion =
        selectedRegionId === "all" ||
        (resource.region_id !== null && resource.region_id.toString() === selectedRegionId)

      return matchesSearch && matchesRegion
    })
  }, [searchQuery, selectedRegionId, resources])

  const courtResources = useMemo(
    () => filteredResources.filter((r) => r.type === "court"),
    [filteredResources]
  )

  const govResources = useMemo(
    () => filteredResources.filter((r) => r.type === "gov"),
    [filteredResources]
  )

  const toolResources = useMemo(
    () => filteredResources.filter((r) => r.type === "tool"),
    [filteredResources]
  )

  const paginatedCourtResources = courtResources.slice(0, courtPage * ITEMS_PER_PAGE)
  const paginatedGovResources = govResources.slice(0, govPage * ITEMS_PER_PAGE)
  const paginatedToolResources = toolResources.slice(0, toolPage * ITEMS_PER_PAGE)

  const hasMoreCourts = courtResources.length > paginatedCourtResources.length
  const hasMoreGov = govResources.length > paginatedGovResources.length
  const hasMoreTools = toolResources.length > paginatedToolResources.length

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load resources: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resource Catalog</h1>
        <p className="text-muted-foreground">
          Quick access to frequently used services, links, and contact information
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <RegionSelect
              regions={regions}
              selectedRegionId={selectedRegionId}
              onRegionChange={setSelectedRegionId}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {isLoading ? (
            "Loading resources..."
          ) : (
            <>
              Showing {filteredResources.length} of {resources.length} resources
            </>
          )}
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Loading resources...</p>
        </Card>
      ) : filteredResources.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No resources found matching your criteria
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {courtResources.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Courts</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedCourtResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  return (
                    <ResourceCard
                      key={`court-${resource.id}`}
                      resource={uiResource}
                    />
                  )
                })}
              </div>
              {hasMoreCourts && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCourtPage((prev) => prev + 1)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </section>
          )}

          {govResources.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Government</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedGovResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  return (
                    <ResourceCard
                      key={`gov-${resource.id}`}
                      resource={uiResource}
                    />
                  )
                })}
              </div>
              {hasMoreGov && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setGovPage((prev) => prev + 1)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </section>
          )}

          {toolResources.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Tools</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedToolResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  return (
                    <ResourceCard
                      key={`tool-${resource.id}`}
                      resource={uiResource}
                    />
                  )
                })}
              </div>
              {hasMoreTools && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setToolPage((prev) => prev + 1)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
