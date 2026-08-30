import type { GlobalConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description:
      'Contact details, legal text and other site-wide content. Changes here update every page.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        revalidateSite(['/', '/about', '/services', '/properties', '/blog', '/contact', '/privacy-policy', '/terms-and-conditions'])
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'address',
              type: 'textarea',
              admin: { description: 'The office address, shown in Reach Us and the footer.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '50%', description: 'e.g. +91 98XXX XXXXX' } },
                { name: 'email', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'whatsapp',
              label: 'WhatsApp number',
              type: 'text',
              admin: { description: 'Digits only with country code, e.g. 919812345678. Leave blank to hide the WhatsApp link.' },
            },
            { name: 'officeHours', type: 'text', admin: { description: 'e.g. Mon to Sat, 10:00 to 19:00' } },
            {
              name: 'mapEmbedUrl',
              label: 'Google Maps embed link',
              type: 'text',
              admin: { description: 'Optional. From Google Maps: Share, Embed a map, copy only the src link.' },
            },
          ],
        },
        {
          label: 'Legal & consent',
          fields: [
            {
              name: 'consentText',
              label: 'Contact form consent text',
              type: 'textarea',
              defaultValue:
                'I agree to be contacted by A2S Estates by phone, WhatsApp or email about my enquiry, and I accept the Privacy Policy.',
              admin: {
                description:
                  'NOTE: the original brief supplied consent text that referred to "Rana Infra", which does not match the A2S Estates brand. It has been rewritten for A2S Estates. Replace this with your legally approved wording.',
              },
            },
            {
              name: 'copyrightName',
              type: 'text',
              defaultValue: 'A2S Estates',
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'Social links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      options: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'X'],
                      admin: { width: '40%' },
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
