// Simplified location dropdown for feed filtering with country and city selection

import { useState } from 'react'
import { MapPin, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FeedLocationDropdownProps {
  country: string | null
  city: string | null
  countries: string[]
  cities: string[]
  onCountryChange: (country: string) => void
  onCityChange: (city: string) => void
  onClear: () => void
}

export function FeedLocationDropdown({
  country,
  city,
  countries,
  cities,
  onCountryChange,
  onCityChange,
  onClear
}: FeedLocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCountrySelect = (value: string) => {
    onCountryChange(value)
    setIsOpen(false)
  }

  const handleCitySelect = (value: string) => {
    onCityChange(value)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {country ? (
        <>
          <Badge variant="outline" className="text-xs px-2 py-1 h-8 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {city ? `${city}, ${country}` : country}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 w-8 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
          {country && cities.length > 0 && !city && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  Add City
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Cities in {country}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={city || ''} onValueChange={handleCitySelect}>
                  {cities.map((cityName) => (
                    <DropdownMenuRadioItem key={cityName} value={cityName}>
                      {cityName}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      ) : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs h-8 w-full md:w-auto">
              <MapPin className="w-3 h-3 mr-1" />
              Location
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Select Country</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={country || ''} onValueChange={handleCountrySelect}>
              {countries.map((countryName) => (
                <DropdownMenuRadioItem key={countryName} value={countryName}>
                  {countryName}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
