// DEPRECATED: Use UniversalReferenceSelector from @/components/shared/UniversalReferenceSelector instead
// City selector component for event location selection
import { useState, useCallback, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, ChevronsUpDown } from 'lucide-react';
import { FPApi } from '@/lib/api';

interface ReferenceListItem {
  id: number;
  name: string;
  name_ru: string;
  code?: string;
}

interface EventCitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  error?: string;
}

export function EventCitySelector({
  value,
  onChange,
  error,
}: EventCitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityResults, setCityResults] = useState<ReferenceListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setCityResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await FPApi.axios.get(`/location/search`, {
        params: { locationType: 'city', searchQuery },
      });
      const data = response.data;

      if (data.items) {
        setCityResults(data.items);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchCities(searchQuery);
      } else {
        setCityResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchCities]);

  const handleSelect = (cityName: string) => {
    onChange(cityName);
    setSearchQuery('');
    setCityResults([]);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${error ? 'border-destructive' : ''}`}
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{value || 'Select city'}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Поиск..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isSearching && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {!isSearching && searchQuery.length < 2 && (
                <CommandEmpty> </CommandEmpty>
              )}
              {!isSearching &&
                searchQuery.length >= 2 &&
                cityResults.length === 0 && (
                  <CommandEmpty>No cities found</CommandEmpty>
                )}
              {!isSearching && cityResults.length > 0 && (
                <CommandGroup>
                  {cityResults.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => handleSelect(city.name)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{city.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
