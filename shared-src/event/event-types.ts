// Type definitions for event functionality in posts

export type EventType = "online" | "offline";

export type EventCategory =
  | "conference"
  | "forum"
  | "webinar"
  | "workshop"
  | "master_class"
  | "meetup"
  | "training"
  | "seminar"
  | "course"
  | "other";

export interface EventLocation {
  country?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
  };
  address: string;
}

export interface EventResponse {
  id?: number;
  post_id?: number;
  eventTypes: EventType[];
  location?: EventLocation;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  website?: string;
  category: EventCategory;
  memberLimit?: number;
  author_id?: string;
}

export interface EventFormErrors {
  eventTypes?: string;
  location?: string;
  country?: string;
  city?: string;
  address?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  website?: string;
  category?: string;
  memberLimit?: string;
}

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "conference", label: "Конференция" },
  { value: "forum", label: "Форум" },
  { value: "seminar", label: "Семинар" },
  { value: "webinar", label: "Вебинар" },
  { value: "workshop", label: "Воркшоп" },
  { value: "master_class", label: "Мастер-класс" },
  { value: "meetup", label: "Встреча" },
  { value: "training", label: "Тренинг" },
  { value: "course", label: "Курс" },
  { value: "other", label: "Другое" },
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  online: "Онлайн",
  offline: "Офлайн",
};

import { z } from "zod";

export const eventSchema = z
  .object({
     id: z.number().optional(),
    post_id: z.number().optional(),
    eventTypes: z.array(z.enum(["online", "offline"])).min(1, "Выберите хотя бы один формат"),
    location: z
      .object({
        country: z
          .object({
            id: z.number(),
            name: z.string(),
          })
          .optional(),
        city: z
          .object({
            id: z.number(),
            name: z.string(),
          })
          .optional(),
        address: z.string(),
      })
      .optional(),
    startDate: z.string().min(1, "Выберите дату начала"),
    startTime: z.string().min(1, "Выберите время начала"),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
    website: z.string().url("Некорректный URL").optional().or(z.literal("")),
    category: z.enum([
      "conference",
      "forum",
      "webinar",
      "workshop",
      "master_class",
      "meetup",
      "training",
      "seminar",
      "course",
      "other",
    ], {
      required_error: "Выберите категорию",
    }),
    memberLimit: z.number().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.eventTypes.includes("offline")) {
      if (!data.location?.country?.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Выберите страну",
          path: ["location", "country"],
        });
      }
      if (!data.location?.city?.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Выберите город",
          path: ["location", "city"],
        });
      }
    }
  });

export type EventFormData = z.infer<typeof eventSchema>;
