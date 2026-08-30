import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/formatSlug'
import { revalidateSite } from '@/lib/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', '_status'],
    description:
      'Articles for the News & Blogs section. Save Draft to keep writing, Publish when it should go live.',
    livePreview: {
      url: ({ data }) => `/blog/${data?.slug ?? ''}`,
    },
  },
  versions: { drafts: { autosave: { interval: 800 } } },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateSite(['/', '/blog', `/blog/${doc?.slug}`, '/sitemap.xml'])
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateSite(['/', '/blog', `/blog/${doc?.slug}`, '/sitemap.xml'])
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'categories',
                  admin: { width: '50%' },
                },
                {
                  name: 'publishedDate',
                  type: 'date',
                  defaultValue: () => new Date().toISOString(),
                  admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
                },
              ],
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description: 'A one or two sentence summary shown on listing cards.',
              },
            },
            { name: 'content', type: 'richText', required: true },
          ],
        },
        {
          label: 'Author & tags',
          fields: [
            {
              name: 'author',
              type: 'text',
              defaultValue: 'A2S Estates',
              admin: { description: 'The byline shown on the article.' },
            },
            {
              name: 'tags',
              type: 'array',
              labels: { singular: 'Tag', plural: 'Tags' },
              fields: [{ name: 'tag', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              label: false,
              type: 'group',
              fields: [
                { name: 'metaTitle', type: 'text', admin: { description: 'Leave blank to use the post title.' } },
                { name: 'metaDescription', type: 'textarea' },
                { name: 'ogImage', label: 'Social share image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Leave blank to generate from the title.' },
      hooks: { beforeValidate: [slugField('title')] },
    },
  ],
}
