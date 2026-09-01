import { SERVICES, type Service } from '@/lib/services'

/**
 * Picks the services an article genuinely relates to, by matching the article's
 * own words against keywords for each service.
 *
 * Deliberately keyword-matched rather than model-generated: a link the writer
 * invented could point at a page that does not exist, and a wrong internal link
 * is worse for search than no link at all.
 */
const SERVICE_KEYWORDS: Record<string, string[]> = {
  'property-consulting': ['consult', 'advice', 'brief', 'shortlist', 'valuation', 'assess'],
  'sale-purchase': ['buy', 'buyer', 'purchase', 'sale', 'selling', 'seller', 'negotiat', 'resale'],
  renting: ['rent', 'lease', 'tenant', 'landlord', 'tenancy'],
  'office-spaces': ['office', 'commercial', 'workspace', 'headcount', 'fit-out'],
  turnkey: ['interior', 'construction', 'fit-out', 'renovat', 'finish', 'snag', 'boq', 'contractor'],
  elevators: ['lift', 'elevator', 'shaft', 'machine room', 'modernis'],
  'home-loans': ['loan', 'lender', 'mortgage', 'financ', 'documentation', 'registry', 'mutation', 'title', 'sanction plan'],
  'post-possession': ['possession', 'handover', 'mutation', 'utility', 'snag', 'maintenance'],
}

export const relatedServices = (haystack: string, limit = 3): Service[] => {
  const text = haystack.toLowerCase()

  const scored = SERVICES.map((service) => {
    const keywords = SERVICE_KEYWORDS[service.id] || []
    const score = keywords.reduce((total, word) => (text.includes(word) ? total + 1 : total), 0)
    return { service, score }
  }).filter((entry) => entry.score > 0)

  scored.sort((a, b) => b.score - a.score)

  // With no keyword hits the article is still about property, so fall back to
  // the two services every enquiry touches rather than rendering nothing.
  if (scored.length === 0) {
    return SERVICES.filter((s) => s.id === 'property-consulting' || s.id === 'sale-purchase')
  }

  return scored.slice(0, limit).map((entry) => entry.service)
}
