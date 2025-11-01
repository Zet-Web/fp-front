// Type definitions for resource catalog entries

export interface ResourceLink {
  label: string
  url: string
  type?: "official" | "service" | "other"
}

export interface ResourceContact {
  phone?: string
  email?: string
  address?: string
  hours?: string
}

export interface Resource {
  id: string
  name: string
  description: string
  category: string
  region: string
  icon?: string
  mainUrl: string
  links: ResourceLink[]
  contacts?: ResourceContact
}

export type ResourceCategory =
  | "government"
  | "legal"
  | "finance"
  | "education"
  | "healthcare"
  | "utilities"
  | "transport"
  | "other"

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  government: "Government Services",
  legal: "Legal Services",
  finance: "Finance & Banking",
  education: "Education",
  healthcare: "Healthcare",
  utilities: "Utilities",
  transport: "Transport",
  other: "Other"
}
