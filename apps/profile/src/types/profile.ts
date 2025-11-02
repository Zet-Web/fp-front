import { ContactInfoEntry } from "./contacts";
import { ProfileExperience } from "./experience";
import { LocationItem } from "./location";

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  cover_url?: string | null;
  about: string | null;
  telegram_username: string | null;
  profile_type: string | null;
  badge: string[] | null;
  created_at?: string;
  cities: LocationItem[];
  countries: LocationItem[];
}

export interface UserAdditionalInfo {
  contact_info: ContactInfoEntry[] | null;
  experience: ProfileExperience[] | null;
}
