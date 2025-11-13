// Utility functions to map database resources to UI resource format

import type { YurServiceResource } from '../types/database'
import type { Resource, ResourceLink, ResourceContact } from '../types/resource'

function parseBlockData(blockString: string | any): { title?: string; link?: string } | null {
  try {
    if (typeof blockString === 'string') {
      const parsed = JSON.parse(blockString)
      return parsed
    }
    return blockString
  } catch (e) {
    return null
  }
}

export function mapDatabaseResourceToUI(dbResource: YurServiceResource): Resource {
  const links: ResourceLink[] = []

  const blocks = [
    dbResource.block1,
    dbResource.block2,
    dbResource.block3,
    dbResource.block4,
    dbResource.block5,
    dbResource.block6,
    dbResource.block7,
    dbResource.block8,
    dbResource.block9,
    dbResource.block10,
  ]

  blocks.forEach((block) => {
    const parsed = parseBlockData(block)
    if (parsed && parsed.title && parsed.link) {
      links.push({
        label: parsed.title,
        url: parsed.link,
        type: 'service',
      })
    }
  })

  const contacts: ResourceContact | undefined =
    dbResource.phone || dbResource.email || dbResource.address || dbResource.worktime
      ? {
          phone: dbResource.phone || undefined,
          email: dbResource.email?.[0] || undefined,
          address: dbResource.address || undefined,
          hours: dbResource.worktime || undefined,
        }
      : undefined

  const blockTop = parseBlockData(dbResource.block_top)
  const mainUrl =
    blockTop?.link ||
    dbResource.website_url ||
    dbResource.services_url ||
    links[0]?.url ||
    '#'

  return {
    id: dbResource.id,
    name: dbResource.title,
    description: dbResource.about || '',
    mainUrl,
    mainButtonLabel: blockTop?.title || 'Открыть',
    imageUrl: dbResource.image_url || undefined,
    websiteUrl: dbResource.website_url || undefined,
    servicesUrl: dbResource.services_url || undefined,
    slug: dbResource.slug || undefined,
    links,
    contacts,
  }
}
