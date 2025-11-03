import { ProfileAward } from "./awards";
import { ContactInfoEntry } from "./contacts";
import { ProfileEducation } from "./education";
import { ProfileExperience } from "./experience";
import { LocationItem } from "./location";

export enum BirthdayVisibility {
  full = "full",
  day_month = "day_month",
  year = "year",
  not_show = "not_show",
}

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
  additional_info: string | null;
  birthday: string | null;
  birthday_visibility: BirthdayVisibility | null;
  birthday_show_age: boolean | null;
}

export interface UserAdditionalInfo {
  contact_info: ContactInfoEntry[] | null;
  experience: ProfileExperience[] | null;
  education: ProfileEducation[] | null;
  awards: ProfileAward[] | null;
}
