/**
 * Writes the firm's official contact details into Site Settings on an existing
 * database, without touching properties, posts or enquiries.
 *
 * Run with: npm run seed:contact
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { CONTACT_DETAILS } from './contact'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })
  await payload.updateGlobal({ slug: 'site-settings', data: CONTACT_DETAILS })

  // Read back: if the database predates a field, Payload drops it silently
  // rather than erroring, which would leave the site showing stale details.
  const saved = await payload.findGlobal({ slug: 'site-settings' })
  const missing = (Object.keys(CONTACT_DETAILS) as (keyof typeof CONTACT_DETAILS)[]).filter(
    (key) => saved[key] !== CONTACT_DETAILS[key],
  )

  if (missing.length > 0) {
    payload.logger.error(
      `These fields did not save: ${missing.join(', ')}. Start the site once with \`npm run dev\` so the database picks up the latest fields, then run this again.`,
    )
    process.exit(1)
  }

  payload.logger.info('Site Settings updated with the official A2S Estates contact details.')
  process.exit(0)
}

void run()
