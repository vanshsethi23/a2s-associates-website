import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [properties, posts] = await Promise.all([
    payload.find({
      collection: 'properties',
      where: { _status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 500,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/properties`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  return [
    ...statics,
    ...properties.docs.map((p) => ({
      url: `${SITE_URL}/properties/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.docs.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
