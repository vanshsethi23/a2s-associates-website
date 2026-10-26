/**
 * The firm's official contact details, as supplied by A2S Estates.
 *
 * These seed the Site Settings global. Once seeded they are CMS-managed:
 * edit them at /admin -> Site Settings, not here. This file exists so a fresh
 * database starts with the real details rather than placeholders, and so
 * `npm run seed:contact` can restore them.
 */
export const CONTACT_DETAILS = {
  address: 'I-9, Basement (Cabin No. 1), Lajpat Nagar - 1, New Delhi - 110024',
  phone: '+91-9891821130',
  phoneSecondary: '+91-9999893722',
  email: 'a2sestates.in@gmail.com',
  officeHours: 'Mon to Sat · 10:00 to 19:00',
  portalUrl: 'https://housing.com/agents/search-A4jvd16ff9e0qye19r4hq79za8',
}

/**
 * Kept apart from CONTACT_DETAILS because that object is verified field by
 * field with a strict comparison after saving, which an array of rows with
 * database-assigned ids would always fail.
 */
export const SOCIAL_LINKS = [
  { platform: 'Instagram' as const, url: 'https://www.instagram.com/a2sestates.in/' },
]
