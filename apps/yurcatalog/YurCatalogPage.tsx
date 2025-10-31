// Resource catalog page for quick access to frequently used services

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { ResourceCard } from "./components/ResourceCard"
import { MOCK_RESOURCES, REGIONS, CATEGORIES } from "./lib/mock-resources"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function YurCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRegion =
        selectedRegion === "All Regions" ||
        resource.region === selectedRegion

      const matchesCategory =
        selectedCategory === "all" ||
        resource.category === selectedCategory

      return matchesSearch && matchesRegion && matchesCategory
    })
  }, [searchQuery, selectedRegion, selectedCategory])

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
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          Showing {filteredResources.length} of {MOCK_RESOURCES.length} resources
        </div>
      </Card>

      {filteredResources.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No resources found matching your criteria
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  )
}
