export enum ContactType {
  phone = "phone",
  email = "email",
  telegram = "telegram",
  whatsapp = "whatsapp",
  github = "github",
  linkedin = "linkedin",
  twitter = "twitter",
  website = "website",
  link = "link",
}

export interface ContactInfoEntry {
  id: string;
  type: ContactType;
  value: string;
  label?: string;
  order: number;
}