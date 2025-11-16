// Event creation form component with clean centered layout
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, MapPin, Calendar, Clock, Users, Link as LinkIcon } from 'lucide-react';
import {
  EventData,
  EventType,
  EVENT_CATEGORIES,
  EVENT_TYPE_LABELS,
  EventFormErrors,
} from './event-types';
import { EventCitySelector } from './EventCitySelector';

interface EventFormCardProps {
  eventData: EventData;
  onChange: (data: EventData) => void;
  errors?: EventFormErrors;
}

export function EventFormCard({ eventData, onChange, errors }: EventFormCardProps) {
  const [localErrors, setLocalErrors] = useState<EventFormErrors>({});
  const displayErrors = errors || localErrors;

  const handleEventTypeToggle = (type: EventType) => {
    const newTypes = eventData.eventTypes.includes(type)
      ? eventData.eventTypes.filter((t) => t !== type)
      : [...eventData.eventTypes, type];

    onChange({ ...eventData, eventTypes: newTypes });

    if (newTypes.length > 0) {
      setLocalErrors({ ...localErrors, eventTypes: undefined });
    }
  };

  const handleCityChange = (city: string) => {
    onChange({
      ...eventData,
      location: {
        city,
        address: eventData.location?.address || '',
      },
    });
    setLocalErrors({ ...localErrors, city: undefined });
  };

  const handleAddressChange = (address: string) => {
    onChange({
      ...eventData,
      location: {
        city: eventData.location?.city || '',
        address,
      },
    });
  };

  const handleStartDateChange = (value: string) => {
    onChange({ ...eventData, startDate: value });
    if (value) {
      setLocalErrors({ ...localErrors, startDate: undefined });
    }
  };

  const handleStartTimeChange = (value: string) => {
    onChange({ ...eventData, startTime: value });
    if (value) {
      setLocalErrors({ ...localErrors, startTime: undefined });
    }
  };

  const handleCategoryChange = (value: string) => {
    onChange({ ...eventData, category: value as EventData['category'] });
    setLocalErrors({ ...localErrors, category: undefined });
  };

  const showLocationFields = eventData.eventTypes.includes('offline');

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>Configure your event settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Event Type *
            </Label>
            <div className="flex flex-wrap gap-3">
              {(['online', 'offline'] as EventType[]).map((type) => (
                <div key={type} className="flex items-center">
                  <Checkbox
                    id={`event-type-${type}`}
                    checked={eventData.eventTypes.includes(type)}
                    onCheckedChange={() => handleEventTypeToggle(type)}
                  />
                  <label
                    htmlFor={`event-type-${type}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {EVENT_TYPE_LABELS[type]}
                  </label>
                </div>
              ))}
            </div>
            {eventData.eventTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {eventData.eventTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {EVENT_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            )}
            {displayErrors.eventTypes && (
              <p className="text-xs text-destructive">{displayErrors.eventTypes}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Category *
            </Label>
            <Select value={eventData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className={displayErrors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {displayErrors.category && (
              <p className="text-xs text-destructive">{displayErrors.category}</p>
            )}
          </div>
        </div>

        {showLocationFields && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                City *
              </Label>
              <EventCitySelector
                value={eventData.location?.city || ''}
                onChange={handleCityChange}
                error={displayErrors.city}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter event address"
                value={eventData.location?.address || ''}
                onChange={(e) => handleAddressChange(e.target.value)}
              />
              {displayErrors.address && (
                <p className="text-xs text-destructive">{displayErrors.address}</p>
              )}
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date *
            </Label>
            <Input
              id="startDate"
              type="date"
              value={eventData.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className={displayErrors.startDate ? 'border-destructive' : ''}
            />
            {displayErrors.startDate && (
              <p className="text-xs text-destructive">{displayErrors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Start Time *
            </Label>
            <Input
              id="startTime"
              type="time"
              value={eventData.startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className={displayErrors.startTime ? 'border-destructive' : ''}
            />
            {displayErrors.startTime && (
              <p className="text-xs text-destructive">{displayErrors.startTime}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={eventData.endDate || ''}
              onChange={(e) => onChange({ ...eventData, endDate: e.target.value })}
              className={displayErrors.endDate ? 'border-destructive' : ''}
            />
            {displayErrors.endDate && (
              <p className="text-xs text-destructive">{displayErrors.endDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={eventData.endTime || ''}
              onChange={(e) => onChange({ ...eventData, endTime: e.target.value })}
              className={displayErrors.endTime ? 'border-destructive' : ''}
            />
            {displayErrors.endTime && (
              <p className="text-xs text-destructive">{displayErrors.endTime}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Website
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              value={eventData.website || ''}
              onChange={(e) => onChange({ ...eventData, website: e.target.value })}
              className={displayErrors.website ? 'border-destructive' : ''}
            />
            {displayErrors.website && (
              <p className="text-xs text-destructive">{displayErrors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberLimit" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Member Limit
            </Label>
            <Input
              id="memberLimit"
              type="number"
              min="1"
              placeholder="No limit"
              value={eventData.memberLimit || ''}
              onChange={(e) =>
                onChange({
                  ...eventData,
                  memberLimit: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className={displayErrors.memberLimit ? 'border-destructive' : ''}
            />
            {displayErrors.memberLimit && (
              <p className="text-xs text-destructive">{displayErrors.memberLimit}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
