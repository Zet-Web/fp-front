// Type definitions for YurService database entities

export interface Region {
  id: number
  name: string
  name_ru: string
  country_id: number
  created_at: string
}

export interface BlockData {
  label?: string
  url?: string
  [key: string]: any
}

export interface YurServiceResource {
  id: number
  title: string
  type: string
  about: string
  image_url: string | null
  block_top: BlockData | null
  block1: BlockData | null
  block2: BlockData | null
  block3: BlockData | null
  block4: BlockData | null
  block5: BlockData | null
  block6: BlockData | null
  block7: BlockData | null
  block8: BlockData | null
  block9: BlockData | null
  block10: BlockData | null
  website_url: string | null
  services_url: string | null
  phone: string | null
  email: string[] | null
  worktime: string | null
  address: string | null
  additional_info: string | null
  created_at: string
  slug: string | null
  order: number | null
  region_id: number | null
  region?: Region
}

export type ResourceType = 'court' | 'gov' | 'tool'
