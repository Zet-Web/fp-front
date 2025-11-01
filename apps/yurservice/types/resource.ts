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
  id: string | number
  name: string
  description: string
  mainUrl: string
  links: ResourceLink[]
  contacts?: ResourceContact
}
