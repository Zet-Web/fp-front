// YurService page with database-driven resource catalog

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, AlertCircle } from "lucide-react"
import { ResourceCard } from "./components/ResourceCard"
import { RegionSelect } from "./components/RegionSelect"
import { useYurServiceData } from "./hooks/use-yurservice-data"
import { useBookmarkResource } from "./hooks/use-bookmark-resource"
import { mapDatabaseResourceToUI } from "./lib/resource-mapper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"

const ITEMS_PER_PAGE = 18

export function YurServicePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all")
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
  const [courtPage, setCourtPage] = useState(1)
  const [govPage, setGovPage] = useState(1)
  const [toolPage, setToolPage] = useState(1)
  const [savedPage, setSavedPage] = useState(1)

  const { user } = useAuth()
  const { resources, regions, isLoading, error } = useYurServiceData()
  const { savedResourceIds, toggleBookmark } = useBookmarkResource()

  const searchFilteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.about && resource.about.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesSearch
    })
  }, [searchQuery, resources])

  const savedResources = useMemo(() => {
    if (!user || savedResourceIds.size === 0) return []
    return searchFilteredResources.filter((r) => savedResourceIds.has(r.id))
  }, [searchFilteredResources, savedResourceIds, user])

  const courtResources = useMemo(() => {
    return searchFilteredResources.filter((r) => {
      if (r.type !== "court") return false

      const matchesRegion =
        selectedRegionId === "all" ||
        (r.region_id !== null && r.region_id.toString() === selectedRegionId)

      return matchesRegion
    })
  }, [searchFilteredResources, selectedRegionId])

  const govResources = useMemo(
    () => searchFilteredResources.filter((r) => r.type === "gov"),
    [searchFilteredResources]
  )

  const toolResources = useMemo(
    () => searchFilteredResources.filter((r) => r.type === "tool"),
    [searchFilteredResources]
  )

  const paginatedSavedResources = savedResources.slice(0, savedPage * ITEMS_PER_PAGE)
  const paginatedCourtResources = courtResources.slice(0, courtPage * ITEMS_PER_PAGE)
  const paginatedGovResources = govResources.slice(0, govPage * ITEMS_PER_PAGE)
  const paginatedToolResources = toolResources.slice(0, toolPage * ITEMS_PER_PAGE)

  const hasMoreSaved = savedResources.length > paginatedSavedResources.length
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
        <h1 className="text-3xl font-bold mb-2">Юр сервисы</h1>
        <p className="text-muted-foreground">
          Каталог сервисов для юристов
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
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
            "Поиск..."
          ) : (
            <>
              Показано {searchFilteredResources.length} из {resources.length} сервисов
              {selectedRegionId !== "all" && " (region filter applies to Courts only)"}
            </>
          )}
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </Card>
      ) : searchFilteredResources.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Не найдено
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {savedResources.length > 0 && user && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Сохранено</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedSavedResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  const cardId = `saved-${resource.id}`
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === cardId}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === cardId ? null : cardId
                        )
                      }
                      isSaved={savedResourceIds.has(resource.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  )
                })}
              </div>
              {hasMoreSaved && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSavedPage((prev) => prev + 1)}
                  >
                    Загрузить еще
                  </Button>
                </div>
              )}
            </section>
          )}

          {courtResources.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Суды</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedCourtResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  const cardId = `court-${resource.id}`
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === cardId}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === cardId ? null : cardId
                        )
                      }
                      isSaved={savedResourceIds.has(resource.id)}
                      onToggleBookmark={toggleBookmark}
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
                    Загрузить еще
                  </Button>
                </div>
              )}
            </section>
          )}

          {govResources.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Ведомства</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedGovResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  const cardId = `gov-${resource.id}`
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === cardId}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === cardId ? null : cardId
                        )
                      }
                      isSaved={savedResourceIds.has(resource.id)}
                      onToggleBookmark={toggleBookmark}
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
                    Загрузить еще
                  </Button>
                </div>
              )}
            </section>
          )}

          {toolResources.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Инструменты</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedToolResources.map((resource) => {
                  const uiResource = mapDatabaseResourceToUI(resource)
                  const cardId = `tool-${resource.id}`
                  return (
                    <ResourceCard
                      key={resource.id}
                      resource={uiResource}
                      isExpanded={expandedCardId === cardId}
                      onToggle={() =>
                        setExpandedCardId(
                          expandedCardId === cardId ? null : cardId
                        )
                      }
                      isSaved={savedResourceIds.has(resource.id)}
                      onToggleBookmark={toggleBookmark}
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
                    Загрузить еще
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
