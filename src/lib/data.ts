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

/**
 * When `serverURL` is configured, Payload returns absolute URLs for files it
 * serves itself (`https://site.com/api/media/file/x.webp`). next/image treats
 * any absolute URL as a remote host and rejects it unless that host is
 * allow-listed, which would mean listing every domain the site ever runs on.
 * Collapsing our own API routes back to a path avoids that entirely.
 *
 * URLs on a real external host (Vercel Blob, S3, R2) are left untouched and
 * are allow-listed in next.config.ts instead.
 */
const toSameOriginPath = (url: string): string => {
  if (!url.startsWith('http')) return url
  try {
    const parsed = new URL(url)
    return parsed.pathname.startsWith('/api/') ? `${parsed.pathname}${parsed.search}` : url
  } catch {
    return url
  }
}

/** Best URL for a media doc at a named size, falling back to the original. */
export const mediaUrl = (media: Media | null, size?: 'thumbnail' | 'card' | 'large' | 'og'): string | null => {
  if (!media) return null
  const url = (size && media.sizes?.[size]?.url) || media.url
  return url ? toSameOriginPath(url) : null
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
