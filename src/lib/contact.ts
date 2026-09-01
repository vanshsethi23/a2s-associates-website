import type { SiteSetting } from '@/payload-types'

/** Both office numbers, primary first, skipping any that are unset. */
export const phoneNumbers = (settings: SiteSetting): string[] =>
  [settings.phone, settings.phoneSecondary].filter((n): n is string => Boolean(n && n.trim()))

export const primaryPhone = (settings: SiteSetting): string | null => phoneNumbers(settings)[0] ?? null

/** Strip spaces and separators so `tel:` links dial correctly. */
export const telHref = (number: string): string => `tel:${number.replace(/[^\d+]/g, '')}`

/**
 * schema.org PostalAddress for the local-business markup. The address is
 * stored as one editable line, so the six-digit PIN is read out of it rather
 * than duplicated into a second field the team would have to keep in sync.
 * A missing or malformed PIN simply omits the property.
 */
export const postalAddressJsonLd = (settings: SiteSetting) => {
  if (!settings.address) return undefined
  const pin = settings.address.match(/\b(\d{6})\b/)?.[1]
  return {
    '@type': 'PostalAddress',
    streetAddress: settings.address.replace(/\s+/g, ' ').trim(),
    addressLocality: 'New Delhi',
    postalCode: pin,
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  }
}
