// Type definitions for event data structures used in test UI variants

export interface EventFormData {
  id?: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  eventType: 'online' | 'offline' | 'hybrid';
  category: string;
  capacity?: number;
  registrationRequired: boolean;
  tags: string[];
}

export interface EventResponse extends EventFormData {
  id: number;
  author_id: string;
  post_id: number;
  created_at: string;
  attendees_count: number;
  is_registered: boolean;
}

export interface EventAttendee {
  id: string;
  name: string | null;
  avatar_url: string | null;
  registered_at: string;
}
