import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Team member', plural: 'Team members' },
  admin: {
    useAsTitle: 'name',
    description: 'People who can log in to this admin panel.',
  },
  auth: true,
  fields: [{ name: 'name', type: 'text', required: true }],
}
