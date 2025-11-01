// Utility functions to map database resources to UI resource format

import type { YurServiceResource } from '../types/database'
import type { Resource, ResourceLink, ResourceContact } from '../types/resource'

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
    if (block && block.label && block.url) {
      links.push({
        label: block.label,
        url: block.url,
        type: block.type || 'other',
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

  const mainUrl =
    dbResource.block_top?.url ||
    dbResource.website_url ||
    dbResource.services_url ||
    links[0]?.url ||
    '#'

  return {
    id: dbResource.id,
    name: dbResource.title,
    description: dbResource.about,
    mainUrl,
    links,
    contacts,
  }
}
