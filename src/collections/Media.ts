import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    description:
      'All images and files used across the website. Upload once, reuse anywhere. Always fill in the description so search engines and screen readers understand the image.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Description (alt text)',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows, e.g. "Marble-clad living room of a Greater Kailash builder floor".',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'thumbnail', width: 480, withoutEnlargement: true },
      { name: 'card', width: 900, withoutEnlargement: true },
      { name: 'large', width: 1600, withoutEnlargement: true },
      { name: 'og', width: 1200, height: 630, crop: 'center', withoutEnlargement: false },
    ],
    adminThumbnail: 'thumbnail',
    formatOptions: { format: 'webp', options: { quality: 82 } },
    resizeOptions: { width: 2400, withoutEnlargement: true },
  },
}
