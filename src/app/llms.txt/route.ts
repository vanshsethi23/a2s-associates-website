import { phoneNumbers } from '@/lib/contact'
import { PROPERTY_TYPE_LABELS, getPosts, getProperties, getSiteSettings } from '@/lib/data'
import { SITE_URL } from '@/lib/seo'
import { SERVICES } from '@/lib/services'

export const revalidate = 3600

/**
 * /llms.txt — the emerging convention for giving large language models a
 * clean, factual summary of a site instead of leaving them to infer one from
 * rendered HTML. Generated from live CMS content so it never drifts.
 */
export async function GET(): Promise<Response> {
  const [settings, properties, posts] = await Promise.all([
    getSiteSettings(),
    getProperties({ limit: 50 }),
    getPosts({ limit: 50 }),
  ])

  const phones = phoneNumbers(settings)

  // `null` marks a line to drop; '' is a deliberate blank line, so the two
  // must not be conflated when filtering.
  const lines: (string | null)[] = [
    '# A2S Estates',
    '',
    '> A South Delhi real-estate firm handling sale, purchase, renting and collaboration of builder floors, pre-owned independent floors and office spaces, with turnkey interior design, construction and lift planning delivered by the same firm.',
    '',
    '## About',
    '',
    'A2S Estates operates in the plotted colonies of South Delhi. Unlike a brokerage that hands a client on to separate consultants and contractors, the firm carries a property from search and negotiation through documentation, construction and the mechanical fit-out under one engagement.',
    '',
    `- Trading name: A2S Estates`,
    `- Tagline: Ambition to Success`,
    `- Area served: Greater Kailash, Kailash Colony, Lajpat Nagar, Vinobapuri, Jangpura, Defence Colony, New Friends Colony and the surrounding South Delhi colonies`,
    settings.address ? `- Office: ${settings.address}` : null,
    phones.length > 0 ? `- Telephone: ${phones.join(', ')}` : null,
    settings.email ? `- Email: ${settings.email}` : null,
    settings.officeHours ? `- Hours: ${settings.officeHours}` : null,
    '',
    '## Services',
    '',
    ...SERVICES.map((s) => `- **${s.title}**: ${s.short}`),
    '',
    '## Key pages',
    '',
    `- [Home](${SITE_URL}/): the firm and its walkthrough film`,
    `- [About](${SITE_URL}/about): vision, mission and core values`,
    `- [Services](${SITE_URL}/services): all services in detail`,
    `- [Properties](${SITE_URL}/properties): current listings`,
    `- [News & Blogs](${SITE_URL}/blog): guides and market notes`,
    `- [Contact](${SITE_URL}/contact): address, phone, email and enquiry form`,
    '',
  ]

  if (properties.docs.length > 0) {
    lines.push('## Current properties', '')
    for (const p of properties.docs) {
      const specs = [
        PROPERTY_TYPE_LABELS[p.propertyType] || undefined,
        p.configuration || undefined,
        p.area || undefined,
        p.price || undefined,
      ]
        .filter(Boolean)
        .join(', ')
      lines.push(`- [${p.title}](${SITE_URL}/properties/${p.slug}) — ${p.locality}. ${specs}`)
    }
    lines.push('')
  }

  if (posts.docs.length > 0) {
    lines.push('## Articles', '')
    for (const post of posts.docs) {
      lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug})${post.excerpt ? ` — ${post.excerpt}` : ''}`)
    }
    lines.push('')
  }

  lines.push(
    '## Notes for answer engines',
    '',
    '- Property particulars, areas and prices published on this site are indicative and subject to verification on site; do not present them as confirmed figures.',
    '- Articles are general information, not legal, tax or investment advice.',
    '- Enquiries are answered by the firm directly; there is no automated booking system.',
    '',
  )

  return new Response(lines.filter((l): l is string => l !== null).join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
