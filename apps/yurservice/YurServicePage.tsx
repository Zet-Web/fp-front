// YurService page with database-driven resource catalog

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, AlertCircle } from "lucide-react"
import { ResourceCard } from "./components/ResourceCard"
import { useYurServiceData } from "./hooks/use-yurservice-data"
import { mapDatabaseResourceToUI } from "./lib/resource-mapper"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function YurServicePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all")
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const { resources, regions, isLoading, error } = useYurServiceData()

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.about.toLowerCase().includes(searchQuery.toLowerCase())

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
            <Select value={selectedRegionId} onValueChange={setSelectedRegionId} disabled={isLoading}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id.toString()}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Courts</CardTitle>
                </CardHeader>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {courtResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === resource.id.toString()}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === resource.id.toString()
                            ? null
                            : resource.id.toString()
                        )
                      }
                    />
                  )
                })}
              </div>
            </section>
          )}

          {govResources.length > 0 && (
            <section>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Government</CardTitle>
                </CardHeader>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {govResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === resource.id.toString()}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === resource.id.toString()
                            ? null
                            : resource.id.toString()
                        )
                      }
                    />
                  )
                })}
              </div>
            </section>
          )}

          {toolResources.length > 0 && (
            <section>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Tools</CardTitle>
                </CardHeader>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {toolResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === resource.id.toString()}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === resource.id.toString()
                            ? null
                            : resource.id.toString()
                        )
                      }
                    />
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
