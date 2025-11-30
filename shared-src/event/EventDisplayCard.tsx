// Component for displaying event information in posts
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { EventResponse, EVENT_TYPE_LABELS } from "./event-types";

interface EventDisplayCardProps {
  eventData: EventResponse;
  compact?: boolean;
}

export function EventDisplayCard({
  eventData,
  compact = false,
}: EventDisplayCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const showLocationFields = eventData.eventTypes.includes("offline");

  if (compact) {
    return (
      <div className="space-y-3 pt-3 border-t">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Calendar className="w-3 h-3" />
            {getCategoryLabel(eventData.category)}
          </Badge>
          {eventData.eventTypes.map((type) => (
            <Badge key={type} className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Globe className="w-3 h-3" />
              {EVENT_TYPE_LABELS[type]}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{formatDate(eventData.startDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">
              {eventData.startTime}
              {eventData.endTime && ` - ${eventData.endTime}`}
            </span>
          </div>

          {showLocationFields && eventData.location?.city && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">{eventData.location.city.name}</span>
            </div>
          )}

          {eventData.memberLimit && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>До {eventData.memberLimit} участников</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {getCategoryLabel(eventData.category)}
            </Badge>
            {eventData.eventTypes.map((type) => (
              <Badge key={type} className="bg-blue-500 hover:bg-blue-600">
                {EVENT_TYPE_LABELS[type]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">Дата начала</div>
              <div className="text-muted-foreground">
                {formatDate(eventData.startDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">Время</div>
              <div className="text-muted-foreground">
                {eventData.startTime}
                {eventData.endTime && ` - ${eventData.endTime}`}
              </div>
            </div>
          </div>

          {eventData.endDate && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Дата завершения</div>
                <div className="text-muted-foreground">
                  {formatDate(eventData.endDate)}
                </div>
              </div>
            </div>
          )}

          {showLocationFields && eventData.location?.city && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Локация</div>
                <div className="text-muted-foreground">
                  {eventData.location.city.name}
                  {eventData.location.address &&
                    `, ${eventData.location.address}`}
                </div>
              </div>
            </div>
          )}

          {eventData.website && (
            <div className="flex items-center gap-3 text-sm md:col-span-2">
              <LinkIcon className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Сайт</div>
                <a
                  href={eventData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate block"
                >
                  {eventData.website}
                </a>
              </div>
            </div>
          )}

          {eventData.memberLimit && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">Всего</div>
                <div className="text-muted-foreground">
                  До {eventData.memberLimit} участников
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
