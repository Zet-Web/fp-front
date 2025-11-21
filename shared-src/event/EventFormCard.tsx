// Event creation form component with clean centered layout
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Calendar, Clock, Users, Link as LinkIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EventResponse,
  EventType,
  EVENT_CATEGORIES,
  EVENT_TYPE_LABELS,
  eventSchema,
} from "./event-types";
import { LocationSelector } from "@/components/shared/LocationSelector";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

interface EventFormCardProps {
  onFormValuesChange: (data: EventResponse) => void;
  onFormValidChange: (valid: boolean) => void;
  defaultEventFormValues?: EventResponse | null;
}

export function EventFormCard({
  defaultEventFormValues: eventData,
  onFormValuesChange,
  onFormValidChange,
}: EventFormCardProps) {
  const form = useForm<EventResponse>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventData || {
      eventTypes: [],
      startDate: "",
      startTime: "",
      category: "conference" as const,
    },
    mode: "onChange",
  });

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  useEffect(() => {
    const subscription = form.watch((value) => {
      onFormValuesChange(value as EventResponse);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormValuesChange]);

  const eventTypes = watch("eventTypes");
  const showLocationFields = eventTypes.includes("offline");

  const ADDRESS_MAX_LENGTH = 200;
  const WEBSITE_MAX_LENGTH = 200;

  const handleEventTypeToggle = (type: EventType) => {
    const currentTypes = eventTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    setValue("eventTypes", newTypes, { shouldValidate: true });
  };

  useEffect(() => {
    onFormValidChange(isValid);
  }, [isValid, onFormValidChange]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Мероприятие</CardTitle>
        <CardDescription>Настройки и детали</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Категория *
            </Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={errors.category ? "border-destructive" : ""}
                  >
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
              )}
            />
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Формат *
            </Label>
            <div className="flex flex-wrap gap-3">
              {(["online", "offline"] as EventType[]).map((type) => (
                <div key={type} className="flex items-center">
                  <Checkbox
                    id={`event-type-${type}`}
                    checked={eventTypes?.includes(type)}
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
            {eventTypes?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {EVENT_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            )}
            {errors.eventTypes && (
              <p className="text-xs text-destructive">
                {errors.eventTypes.message}
              </p>
            )}
          </div>
        </div>

        {showLocationFields && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="location.country"
                  render={({ field }) => (
                    <LocationSelector
                      type="country"
                      value={field.value?.id || 0}
                      onChange={(id, name) => {
                        field.onChange({ id, name });
                        setValue("location.city", undefined); // Reset city
                      }}
                      label="Страна *"
                      error={errors.location?.country?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="location.city"
                  render={({ field }) => (
                    <LocationSelector
                      type="city"
                      value={field.value?.id || 0}
                      onChange={(id, name) => field.onChange({ id, name })}
                      label="Город *"
                      error={errors.location?.city?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="address">Адрес</Label>
                <CharacterCounter
                  current={eventData?.location?.address?.length || 0}
                  max={ADDRESS_MAX_LENGTH}
                />
              </div>
              <Input
                id="address"
                placeholder="Enter event address"
                {...register("location.address")}
              />
              {errors.location?.address && (
                <p className="text-xs text-destructive">
                  {errors.location.address.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Дата начала *
            </Label>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
              className={errors.startDate ? "border-destructive" : ""}
            />
            {errors.startDate && (
              <p className="text-xs text-destructive">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Время начала *
            </Label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime")}
              className={errors.startTime ? "border-destructive" : ""}
            />
            {errors.startTime && (
              <p className="text-xs text-destructive">
                {errors.startTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="endDate">Дата завершения</Label>
            <Input
              id="endDate"
              type="date"
              {...register("endDate")}
              className={errors.endDate ? "border-destructive" : ""}
            />
            {errors.endDate && (
              <p className="text-xs text-destructive">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">Время завершения</Label>
            <Input
              id="endTime"
              type="time"
              {...register("endTime")}
              className={errors.endTime ? "border-destructive" : ""}
            />
            {errors.endTime && (
              <p className="text-xs text-destructive">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="website" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Сайт
              </Label>
              <CharacterCounter
                current={eventData?.website?.length || 0}
                max={WEBSITE_MAX_LENGTH}
              />
            </div>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              {...register("website")}
              className={errors.website ? "border-destructive" : ""}
            />
            {errors.website && (
              <p className="text-xs text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberLimit" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Лимит участников
            </Label>
            <Controller
              control={control}
              name="memberLimit"
              render={({ field }) => (
                <Input
                  {...field}
                  id="memberLimit"
                  type="number"
                  min="1"
                  placeholder="No limit"
                  value={field.value || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? parseInt(val, 10) : undefined);
                  }}
                  className={errors.memberLimit ? "border-destructive" : ""}
                />
              )}
            />
            {errors.memberLimit && (
              <p className="text-xs text-destructive">
                {errors.memberLimit.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
