import { NetworkFiltersState, ConnectionType, ViewMode } from "../types/network";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, X } from "lucide-react";
import { getConnectionTypeLabel } from "../lib/network-utils";

interface NetworkFiltersProps {
  filters: NetworkFiltersState;
  onFiltersChange: (filters: NetworkFiltersState) => void;
}

const CONNECTION_TYPE_OPTIONS: ConnectionType[] = [
  "direct",
  "community",
  "event",
  "follower",
  "following",
];

export function NetworkFilters({ filters, onFiltersChange }: NetworkFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleConnectionTypeToggle = (type: ConnectionType) => {
    const newTypes = filters.connectionTypes.includes(type)
      ? filters.connectionTypes.filter((t) => t !== type)
      : [...filters.connectionTypes, type];
    onFiltersChange({ ...filters, connectionTypes: newTypes });
  };

  const handleViewModeChange = (viewMode: ViewMode) => {
    onFiltersChange({ ...filters, viewMode });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      connectionTypes: [],
      communities: [],
      connectionLevel: "all",
      showMutualOnly: false,
      viewMode: "all",
    });
  };

  const activeFilterCount =
    filters.connectionTypes.length +
    filters.communities.length +
    (filters.connectionLevel !== "all" ? 1 : 0) +
    (filters.showMutualOnly ? 1 : 0) +
    (filters.viewMode !== "all" ? 1 : 0);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или юзернейму..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            {/* Тип связи (подписки/профили/мероприятия) */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  {filters.viewMode === "subscriptions" && "Подписки"}
                  {filters.viewMode === "profiles" && "Профили"}
                  {filters.viewMode === "events" && "Мероприятия"}
                  {filters.viewMode === "all" && "Все связи"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2 text-sm">
                  <button
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent"
                    onClick={() => handleViewModeChange("all")}
                  >
                    Все связи
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent"
                    onClick={() => handleViewModeChange("subscriptions")}
                  >
                    Подписки (на кого я подписан)
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent"
                    onClick={() => handleViewModeChange("profiles")}
                  >
                    Профили (общие профили)
                  </button>
                  <button
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent"
                    onClick={() => handleViewModeChange("events")}
                  >
                    Мероприятия (общие события)
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Детальный фильтр по типу связи */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  Тип связи +
                  {filters.connectionTypes.length > 0 && (
                    <Badge
                      variant="default"
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
                    >
                      {filters.connectionTypes.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-3">Тип связи</h4>
                  {CONNECTION_TYPE_OPTIONS.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.connectionTypes.includes(type)}
                        onCheckedChange={() => handleConnectionTypeToggle(type)}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {getConnectionTypeLabel(type)}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


