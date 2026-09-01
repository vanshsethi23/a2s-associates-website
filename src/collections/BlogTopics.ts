import type { CollectionConfig } from 'payload'

export const BlogTopics: CollectionConfig = {
  slug: 'blog-topics',
  labels: { singular: 'Blog topic', plural: 'Blog topics' },
  admin: {
    useAsTitle: 'topic',
    defaultColumns: ['topic', 'status', 'usedAt'],
    description:
      'The queue the automatic writer works through. Add topics you want covered; the next scheduled post (Monday and Saturday) takes the oldest one still marked Queued. If the queue is empty the writer falls back to its own South Delhi property topics, so the site never goes quiet.',
    group: 'Blog',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'topic',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "How stilt parking rights are allocated in a builder floor rebuild"' },
    },
    {
      name: 'angle',
      type: 'textarea',
      admin: {
        description:
          'Optional. Anything the article must cover or avoid, in plain English. Passed to the writer as instructions.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'queued',
      options: [
        { label: 'Queued', value: 'queued' },
        { label: 'Published', value: 'published' },
        { label: 'Skipped', value: 'skipped' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'usedAt',
      label: 'Published on',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: { position: 'sidebar', readOnly: true, description: 'The article generated from this topic.' },
    },
  ],
}
