import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/formatSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Blog category', plural: 'Blog categories' },
  admin: {
    useAsTitle: 'title',
    description: 'Categories for organising blog posts, e.g. Market Notes, Guides, Firm News.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: { beforeValidate: [slugField('title')] },
    },
  ],
}
