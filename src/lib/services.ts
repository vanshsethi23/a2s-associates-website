export type Service = {
  id: string
  title: string
  short: string
  long: string[]
}

export const SERVICES: Service[] = [
  {
    id: 'property-consulting',
    title: 'Property Consulting',
    short: 'Localities, floors and paperwork assessed on what they can actually do for you.',
    long: [
      'Before a single site visit, we agree the brief in writing: budget, locality, configuration and what the space has to do. Every option you then see is assessed against it, with its title status, sanction position and realistic negotiating range set out plainly.',
      'The advice covers builder floors, pre-owned independent floors, office spaces and plots offered for collaboration, across the South Delhi colonies we work in daily.',
    ],
  },
  {
    id: 'sale-purchase',
    title: 'Sale & Purchase',
    short: 'One team carries the search, the negotiation and the paperwork, start to signature.',
    long: [
      'For buyers, we shortlist only what fits the written brief, accompany every visit, and negotiate with the diligence already done, so the price you agree is the price you close at.',
      'For sellers, we prepare the floor and its papers before the first showing, qualify buyers before they visit, and manage the transaction through registration.',
    ],
  },
  {
    id: 'renting',
    title: 'Renting of Builder & Pre-Owned Floors',
    short: 'Residential leases handled with the same paper discipline as a sale.',
    long: [
      'Tenancies fail on vague agreements. We draft lease terms that record the condition, the fittings, the maintenance split and the exit terms, and we stay the point of contact for both sides through the lease.',
    ],
  },
  {
    id: 'office-spaces',
    title: 'Office Spaces',
    short: 'Commercial floors matched to headcount, power and access, not just address.',
    long: [
      'We represent office floors and commercial units where the practical questions are answered before you visit: power provisioning, lift capacity, parking counts and fit-out permissions. Where a fit-out is needed, the turnkey team can quote it under the same engagement.',
    ],
  },
  {
    id: 'turnkey',
    title: 'Turnkey Projects · Interior Design & Construction',
    short: 'Drawings, BOQ and execution under one contract, from design to handover.',
    long: [
      'One contract covers design development, working drawings, the bill of quantities and execution, with stage payments tied to progress you can walk through. The firm that helped you buy the floor is the firm accountable for finishing it.',
    ],
  },
  {
    id: 'elevators',
    title: 'Elevators (Lift) Planning & Modernisation',
    short: 'Shaft planning for new builds; surveyed, comparable quotes for modernisation.',
    long: [
      'For rebuilds, we advise on shaft position, dimensions and power provisioning at design stage, when the decisions are cheap. For standing buildings, we survey the shaft and wiring, then obtain comparable modernisation quotes with the service contract negotiated alongside the machine.',
    ],
  },
  {
    id: 'home-loans',
    title: 'Home Loan & Documentation Assistance',
    short: 'Lender coordination and a clean paper trail, managed alongside the deal.',
    long: [
      'We coordinate with lenders, prepare the document file they will ask for, and sequence sanction against the transaction timeline, so financing never stalls a closing. Title search, agreement drafting and registration are handled with empanelled lawyers.',
    ],
  },
  {
    id: 'post-possession',
    title: 'Post-Possession Support',
    short: 'Mutation, utilities and the snag list, closed out after the keys change hands.',
    long: [
      'Possession is not the end of the work. We follow through on mutation, utility transfers, maintenance handovers and the construction snag list, until the floor runs the way it was promised to.',
    ],
  },
]
