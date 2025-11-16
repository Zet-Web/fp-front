// Type definitions for event functionality in posts

export type EventType = 'online' | 'offline' | 'hybrid';

export type EventCategory =
  | 'conference'
  | 'forum'
  | 'webinar'
  | 'workshop'
  | 'master_class'
  | 'meetup'
  | 'training'
  | 'seminar'
  | 'course'
  | 'other';

export interface EventLocation {
  city: string;
  address: string;
}

export interface EventData {
  eventTypes: EventType[];
  location?: EventLocation;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  website?: string;
  category: EventCategory;
  memberLimit?: number;
}

export interface EventFormErrors {
  eventTypes?: string;
  location?: string;
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
  { value: 'conference', label: 'Conference' },
  { value: 'forum', label: 'Forum' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'master_class', label: 'Master Class' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'training', label: 'Training' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'course', label: 'Course' },
  { value: 'other', label: 'Other' },
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
};
