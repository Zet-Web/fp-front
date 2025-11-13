// Searchable region dropdown component

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Region } from "../types/database"

interface RegionSelectProps {
  regions: Region[]
  selectedRegionId: string
  onRegionChange: (regionId: string) => void
  disabled?: boolean
}

export function RegionSelect({
  regions,
  selectedRegionId,
  onRegionChange,
  disabled = false,
}: RegionSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedRegion = useMemo(() => {
    if (selectedRegionId === "all") return null
    return regions.find((r) => r.id.toString() === selectedRegionId)
  }, [regions, selectedRegionId])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
          disabled={disabled}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="truncate">
            {selectedRegion ? selectedRegion.name : "Все регионаы"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search regions..." />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onRegionChange("all")
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedRegionId === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                Все регионы
              </CommandItem>
              {regions.map((region) => (
                <CommandItem
                  key={region.id}
                  value={region.name}
                  onSelect={() => {
                    onRegionChange(region.id.toString())
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedRegionId === region.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {region.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
