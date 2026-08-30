import { getPayload } from 'payload'
import { cache } from 'react'
import config from '@payload-config'

import type { Media, Post, Property, SiteSetting } from '@/payload-types'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
})

export const getFeaturedProperties = cache(async (limit = 3): Promise<Property[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'properties',
    where: { featured: { equals: true }, _status: { equals: 'published' } },
    sort: '-updatedAt',
    limit,
    depth: 1,
  })
  return res.docs
})

export const getProperties = cache(
  async (opts: { type?: string; locality?: string; page?: number; limit?: number } = {}) => {
    const payload = await getPayloadClient()
    const where: Record<string, unknown> = { _status: { equals: 'published' } }
    if (opts.type) {
      if (opts.type === 'rent') where['listingType'] = { equals: 'rent' }
      else if (opts.type === 'sale') where['listingType'] = { equals: 'sale' }
      else where['propertyType'] = { equals: opts.type }
    }
    if (opts.locality) {
      // footer quick-links pass slugs like "greater-kailash"; match loosely on the first word
      const words = opts.locality.replace(/-/g, ' ').trim()
      where['locality'] = { like: words.split(' ')[0] }
    }
    return payload.find({
      collection: 'properties',
      where: where as never,
      sort: '-updatedAt',
      limit: opts.limit ?? 12,
      page: opts.page ?? 1,
      depth: 1,
    })
  },
)

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'properties',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export const getPosts = cache(async (opts: { page?: number; limit?: number } = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: opts.limit ?? 9,
    page: opts.page ?? 1,
    depth: 1,
  })
})

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

/** Resolve an upload relation into a Media doc (depth>=1 gives objects). */
export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in (value as Record<string, unknown>)
    ? (value as Media)
    : null

/** Best URL for a media doc at a named size, falling back to the original. */
export const mediaUrl = (media: Media | null, size?: 'thumbnail' | 'card' | 'large' | 'og'): string | null => {
  if (!media) return null
  if (size && media.sizes?.[size]?.url) return media.sizes[size]!.url!
  return media.url ?? null
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: 'Available',
  'under-offer': 'Under offer',
  'under-construction': 'Under construction',
  sold: 'Sold',
  rented: 'Rented',
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'builder-floor': 'Builder floor',
  'pre-owned-floor': 'Pre-owned floor',
  'independent-house': 'Independent house',
  'office-space': 'Office space',
  plot: 'Plot / collaboration',
}
