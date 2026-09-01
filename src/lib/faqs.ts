import type { FaqEntry } from '@/lib/seo'

/**
 * Questions clients actually ask, answered plainly.
 *
 * These are rendered visibly on the Services page and marked up as FAQPage.
 * Answer engines quote the visible text, so the two must always match: never
 * add a question to the schema that is not on the page.
 *
 * Answers deliberately avoid specific figures, fees and legal thresholds,
 * which change and would age badly as published claims.
 */
export const SERVICE_FAQS: FaqEntry[] = [
  {
    question: 'What is a builder floor in South Delhi?',
    answer:
      'A builder floor is a single residence occupying one entire floor of a low-rise plotted building, usually one of four floors, with stilt parking below and increasingly a lift. You own your floor outright together with a proportionate undivided share of the land beneath it, so there are no shared walls or common corridors of the kind an apartment has.',
  },
  {
    question: 'Which South Delhi localities does A2S Estates cover?',
    answer:
      'A2S Estates works across the South Delhi plotted colonies, principally Greater Kailash, Kailash Colony, Lajpat Nagar, Vinobapuri, Jangpura, Defence Colony and New Friends Colony, along with neighbouring blocks in the same belt.',
  },
  {
    question: 'What documents should I check before buying a builder floor?',
    answer:
      'Trace the chain of title through each registered sale deed until it closes cleanly, confirm that mutation is complete in the municipal record, compare the sanctioned plan against what was actually built, obtain an encumbrance certificate and clear all property tax and utility dues. Confirm in the agreement itself who holds roof rights and how stilt parking is allocated. A2S coordinates this diligence with empanelled lawyers before money moves.',
  },
  {
    question: 'Does A2S Estates handle interiors and construction as well as the sale?',
    answer:
      'Yes. Turnkey interior design and construction sit inside the firm rather than being referred out, so one contract covers design development, working drawings, the bill of quantities and execution, with stage payments tied to progress you can inspect. The firm that sells you the floor is the firm accountable for finishing it.',
  },
  {
    question: 'Can A2S help with a lift for an existing building?',
    answer:
      'Yes. For new rebuilds the firm advises on shaft position, dimensions and power provisioning at design stage, when those decisions are still inexpensive. For standing buildings it surveys the shaft and wiring, then obtains comparable modernisation quotes with the service contract negotiated alongside the machine.',
  },
  {
    question: 'How quickly does A2S Estates respond to an enquiry?',
    answer:
      'Enquiries submitted through the website reach the team directly and are answered in writing, ordinarily within one working day. The office is open Monday to Saturday, and you can also call or email using the details on the contact page.',
  },
]
