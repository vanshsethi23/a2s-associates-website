import { phoneNumbers, postalAddressJsonLd } from '@/lib/contact'
import type { SiteSetting } from '@/payload-types'

export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
export const SITE_NAME = 'A2S Estates'

/** Absolute URL for schema.org and social tags, which must not be relative. */
export const absoluteUrl = (path: string): string =>
  path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

/**
 * Stable @id values let search and answer engines merge every mention of the
 * firm into one entity instead of treating each page as a separate business.
 */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** The localities A2S actually works in, emitted as areaServed. */
export const AREAS_SERVED = [
  'Greater Kailash',
  'Kailash Colony',
  'Lajpat Nagar',
  'Vinobapuri',
  'Jangpura',
  'Defence Colony',
  'New Friends Colony',
  'South Delhi',
]

export const organizationJsonLd = (settings: SiteSetting) => {
  const socials = (settings.socialLinks || []).map((l) => l.url).filter(Boolean)
  return {
    '@type': 'RealEstateAgent',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/brand/logo-horizontal-light.png'),
      caption: `${SITE_NAME} logo`,
    },
    image: absoluteUrl('/og-home.jpg'),
    slogan: 'Ambition to Success',
    description:
      'A2S Estates handles sale, purchase, renting and collaboration of builder floors, pre-owned floors and office spaces across South Delhi, with turnkey interior design, construction and lift planning under one roof.',
    telephone: phoneNumbers(settings),
    email: settings.email || undefined,
    address: postalAddressJsonLd(settings),
    areaServed: AREAS_SERVED.map((name) => ({ '@type': 'Place', name })),
    knowsAbout: [
      'South Delhi builder floors',
      'Pre-owned independent floors',
      'Office space leasing in Delhi',
      'Property documentation and mutation',
      'Turnkey interior design and construction',
      'Elevator planning and modernisation',
    ],
    ...(settings.officeHours ? { openingHours: settings.officeHours } : {}),
    ...(socials.length > 0 ? { sameAs: socials } : {}),
  }
}

export const websiteJsonLd = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/properties?type={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
})

/** Breadcrumbs give engines the site's hierarchy and earn richer results. */
export const breadcrumbJsonLd = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
})

export type FaqEntry = { question: string; answer: string }

/**
 * FAQPage is the highest-leverage answer-engine markup: it is what AI
 * Overviews, voice assistants and chat engines quote directly.
 */
export const faqJsonLd = (faqs: FaqEntry[]) =>
  faqs.length > 0
    ? {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : undefined

/** Wraps nodes into a single @graph so one script tag describes the page. */
export const jsonLdGraph = (...nodes: (object | undefined)[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})

/** Renders a JSON-LD graph; keeps the escaping rule in one place. */
export const jsonLdScript = (graph: object) => JSON.stringify(graph).replace(/</g, '\\u003c')
