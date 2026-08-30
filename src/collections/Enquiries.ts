import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'phone', 'status', 'createdAt'],
    description:
      'Messages submitted through the website contact form. Update the status as you work through them.',
  },
  access: {
    // Created via the public contact form (server action); read/manage only when logged in.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'lastName', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      admin: { description: 'Filled in automatically when the enquiry came from a property page.' },
    },
    { name: 'consent', label: 'Accepted the contact consent text', type: 'checkbox' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Internal notes. Never shown on the website.' },
    },
  ],
}
