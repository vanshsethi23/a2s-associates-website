import type { CollectionConfig } from 'payload'

import { slugField } from '@/lib/formatSlug'
import { revalidateSite } from '@/lib/revalidate'

export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: { singular: 'Property', plural: 'Properties' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'locality', 'listingType', 'availability', 'featured', '_status'],
    description:
      'Every property listed on the website. Fill in the form, upload photographs, then press Publish. Save Draft keeps it hidden from the website until you are ready.',
    livePreview: {
      url: ({ data }) => `/properties/${data?.slug ?? ''}`,
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
        revalidateSite(['/', '/properties', `/properties/${doc?.slug}`, '/sitemap.xml'])
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateSite(['/', '/properties', `/properties/${doc?.slug}`, '/sitemap.xml'])
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'title',
              label: 'Property name',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Builder Floor, Greater Kailash II · Second Level"' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'locality',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'e.g. Greater Kailash, Lajpat Nagar, Jangpura',
                  },
                },
                {
                  name: 'location',
                  label: 'Wider location',
                  type: 'text',
                  defaultValue: 'South Delhi',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'propertyType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Builder floor', value: 'builder-floor' },
                    { label: 'Pre-owned floor', value: 'pre-owned-floor' },
                    { label: 'Independent house', value: 'independent-house' },
                    { label: 'Office space', value: 'office-space' },
                    { label: 'Plot / collaboration', value: 'plot' },
                  ],
                  admin: { width: '34%' },
                },
                {
                  name: 'listingType',
                  label: 'Offered for',
                  type: 'select',
                  required: true,
                  defaultValue: 'sale',
                  options: [
                    { label: 'Sale', value: 'sale' },
                    { label: 'Rent', value: 'rent' },
                    { label: 'Collaboration', value: 'collaboration' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'availability',
                  label: 'Status',
                  type: 'select',
                  required: true,
                  defaultValue: 'available',
                  options: [
                    { label: 'Available', value: 'available' },
                    { label: 'Under offer', value: 'under-offer' },
                    { label: 'Under construction', value: 'under-construction' },
                    { label: 'Sold', value: 'sold' },
                    { label: 'Rented', value: 'rented' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'configuration',
                  type: 'text',
                  admin: { width: '25%', description: 'e.g. 4 BHK + Study' },
                },
                {
                  name: 'area',
                  type: 'text',
                  admin: { width: '25%', description: 'e.g. 2,150 sq ft' },
                },
                {
                  name: 'floor',
                  type: 'text',
                  admin: { width: '25%', description: 'e.g. Second of four' },
                },
                {
                  name: 'facing',
                  type: 'text',
                  admin: { width: '25%', description: 'e.g. East · Park facing' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Price (display text)',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Shown as written, e.g. "₹ 4.25 Cr" or "₹ 3.45 Lakh / month". Leave blank for "On request".',
                  },
                },
                {
                  name: 'priceNote',
                  type: 'text',
                  admin: { width: '50%', description: 'e.g. Negotiable · All inclusive' },
                },
              ],
            },
            {
              name: 'featured',
              label: 'Feature on the home page',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'The main write-up shown on the property page.',
              },
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'highlights',
              type: 'array',
              labels: { singular: 'Highlight', plural: 'Highlights' },
              admin: {
                description: 'Short, factual lines, e.g. "Private lift lobby on every floor".',
              },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'amenities',
              type: 'array',
              labels: { singular: 'Amenity', plural: 'Amenities' },
              admin: { description: 'e.g. Lift, Stilt parking, Power backup, Terrace rights' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            {
              name: 'specifications',
              type: 'array',
              labels: { singular: 'Specification', plural: 'Specifications' },
              admin: {
                description: 'Label and value pairs shown in the specification table, e.g. "Parking" / "2 covered".',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              label: 'Cover photograph',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'The lead image on cards and at the top of the property page.' },
            },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Photograph', plural: 'Gallery' },
              admin: {
                description: 'Drag the rows to reorder. The order here is the order on the website.',
              },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'floorPlans',
              type: 'array',
              labels: { singular: 'Floor plan', plural: 'Floor plans' },
              fields: [
                { name: 'label', type: 'text', admin: { description: 'e.g. Second floor · 2,150 sq ft' } },
                { name: 'file', label: 'Image or PDF', type: 'upload', relationTo: 'media', required: true },
              ],
            },
            {
              name: 'videoUrl',
              label: 'Video link',
              type: 'text',
              admin: { description: 'YouTube or Vimeo link for a walkthrough film, if available.' },
            },
            {
              name: 'videoFile',
              label: 'Video file',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Or upload an MP4/WebM directly (keep it under ~50 MB).' },
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
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: { description: 'Leave blank to use the property name.' },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  admin: { description: 'One or two sentences, under 160 characters.' },
                },
                {
                  name: 'ogImage',
                  label: 'Social share image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Leave blank to use the cover photograph.' },
                },
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
      admin: {
        position: 'sidebar',
        description: 'The web address, e.g. "builder-floor-greater-kailash-2". Leave blank to generate from the name.',
      },
      hooks: { beforeValidate: [slugField('title')] },
    },
  ],
}
