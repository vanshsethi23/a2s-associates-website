/**
 * Seed script: creates the first admin user, site settings and sample
 * content so the site renders fully on first run.
 *
 * ALL PROPERTY LISTINGS AND CONTACT DETAILS SEEDED HERE ARE SAMPLE /
 * PLACEHOLDER CONTENT. Replace them through the admin panel (/admin)
 * before going live.
 *
 * Run with: npm run seed
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const assets = path.resolve(dirname, '../../seed-assets')

type Para = { text: string; heading?: 'h2' | 'h3' }

const rt = (blocks: (string | Para)[]) => ({
  root: {
    type: 'root' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: blocks.map((b) => {
      const item: Para = typeof b === 'string' ? { text: b } : b
      const textNode = {
        type: 'text',
        text: item.text,
        format: 0,
        style: '',
        mode: 'normal',
        detail: 0,
        version: 1,
      }
      if (item.heading) {
        return {
          type: 'heading',
          tag: item.heading,
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [textNode],
        }
      }
      return {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [textNode],
      }
    }),
  },
})

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.totalDocs > 0) {
    payload.logger.info('Seed skipped: users already exist.')
    process.exit(0)
  }

  payload.logger.info('Seeding admin user...')
  await payload.create({
    collection: 'users',
    data: {
      name: 'A2S Admin',
      email: process.env.PAYLOAD_ADMIN_EMAIL || 'admin@a2sestates.local',
      password: process.env.PAYLOAD_ADMIN_PASSWORD || 'a2s-change-me',
    },
  })

  payload.logger.info('Uploading media...')
  const media: Record<string, number> = {}
  const uploads: [string, string][] = [
    ['facade-dusk', 'Classical stone facade of a four-storey South Delhi builder floor at dusk'],
    ['facade-approach', 'Street approach to a luxury builder floor with wrought iron balconies'],
    ['balcony-window', 'French windows and iron balcony rail opening into a builder floor residence'],
    ['living', 'Formal living and dining room in warm neutral tones with layered lighting'],
    ['kitchen-wide', 'Open kitchen with marble island and full-height cabinetry'],
    ['kitchen-island', 'Marble-topped kitchen island with seating for four'],
    ['bedroom', 'Principal bedroom with upholstered headboard and cove lighting'],
    ['bedroom-suite', 'Bedroom suite opening onto a private balcony with green views'],
    ['facade-upper', 'Upper floors and arched terrace level of a classical builder floor'],
    ['terrace', 'Landscaped private roof terrace with pergola, bar and cabana'],
    ['terrace-wide', 'Roof terrace with frangipani planting overlooking the South Delhi skyline'],
  ]
  for (const [name, alt] of uploads) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(assets, `${name}.webp`),
    })
    media[name] = doc.id as number
  }

  payload.logger.info('Seeding site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      // PLACEHOLDERS: replace with the firm's real details in /admin -> Site Settings.
      address: 'Office address to be supplied · South Delhi, New Delhi 110048',
      phone: '+91 00000 00000',
      email: 'hello@a2sestates.in',
      officeHours: 'Mon to Sat · 10:00 to 19:00',
      copyrightName: 'A2S Estates',
      consentText:
        'I agree to be contacted by A2S Estates by phone, WhatsApp or email about my enquiry, and I accept the Privacy Policy.',
    },
  })

  payload.logger.info('Seeding categories...')
  const catGuides = await payload.create({ collection: 'categories', data: { title: 'Guides', slug: 'guides' } })
  const catMarket = await payload.create({ collection: 'categories', data: { title: 'Market Notes', slug: 'market-notes' } })
  await payload.create({ collection: 'categories', data: { title: 'Firm News', slug: 'firm-news' } })

  payload.logger.info('Seeding properties (sample listings)...')
  const properties = [
    {
      title: 'Builder Floor, Greater Kailash II',
      slug: 'builder-floor-greater-kailash-2',
      locality: 'Greater Kailash II',
      propertyType: 'builder-floor',
      listingType: 'sale',
      availability: 'available',
      configuration: '4 BHK + Study',
      area: '2,150 sq ft',
      floor: 'Second of four',
      facing: 'East · Park facing',
      price: '₹ 4.25 Cr',
      priceNote: 'Negotiable',
      featured: true,
      heroImage: media['facade-dusk'],
      description: rt([
        'A newly built second-floor residence in one of Greater Kailash II’s quieter blocks, finished to the standard the colony now expects: Italian marble underfoot, veneered wardrobes, and a lift that opens into a private lobby.',
        'The floor plan runs front to back, so the formal rooms take the park light while the bedrooms settle into the rear of the plot. A study off the living room works equally well as a fourth bedroom.',
        'This is a sample listing seeded for demonstration. Replace it with live inventory through the admin panel.',
      ]),
      highlights: [
        { text: 'Private lift lobby on every floor' },
        { text: 'Italian marble flooring throughout' },
        { text: 'Two covered car parks at stilt level' },
        { text: 'Park-facing balcony across the drawing room' },
      ],
      amenities: [
        { name: 'Lift' },
        { name: 'Stilt parking' },
        { name: 'Power backup' },
        { name: 'Modular kitchen' },
        { name: 'VRV air conditioning' },
      ],
      specifications: [
        { label: 'Configuration', value: '4 bedrooms, study, 4 baths' },
        { label: 'Built-up area', value: '2,150 sq ft (approx.)' },
        { label: 'Floor', value: 'Second of four, with lift' },
        { label: 'Parking', value: '2 covered, stilt level' },
        { label: 'Possession', value: 'Ready to move' },
      ],
      gallery: [
        { image: media['living'], caption: 'Formal living and dining' },
        { image: media['kitchen-wide'], caption: 'Open kitchen' },
        { image: media['bedroom'], caption: 'Principal bedroom' },
        { image: media['balcony-window'], caption: 'Balcony detail' },
      ],
    },
    {
      title: 'Terrace Residence, Kailash Colony',
      slug: 'terrace-residence-kailash-colony',
      locality: 'Kailash Colony',
      propertyType: 'builder-floor',
      listingType: 'sale',
      availability: 'available',
      configuration: '3 BHK + Terrace',
      area: '1,980 sq ft + terrace',
      floor: 'Top floor with terrace rights',
      facing: 'North-east',
      price: '₹ 5.10 Cr',
      priceNote: 'Terrace rights included',
      featured: true,
      heroImage: media['terrace-wide'],
      description: rt([
        'The top floor of a classically detailed new build, sold with full rights to the landscaped roof terrace above: pergola, outdoor bar and planting already in place.',
        'Inside, three bedrooms and an open living-dining floor take the corner light. Upstairs, the terrace runs the full footprint of the plot and reads as a private garden over the colony’s treeline.',
        'This is a sample listing seeded for demonstration. Replace it with live inventory through the admin panel.',
      ]),
      highlights: [
        { text: 'Full private terrace with pergola and bar' },
        { text: 'Corner plot light on two sides' },
        { text: 'Lift access to the residence level' },
      ],
      amenities: [
        { name: 'Lift' },
        { name: 'Terrace rights' },
        { name: 'Power backup' },
        { name: 'Covered parking' },
      ],
      specifications: [
        { label: 'Configuration', value: '3 bedrooms, 3 baths' },
        { label: 'Built-up area', value: '1,980 sq ft + terrace' },
        { label: 'Floor', value: 'Fourth, with terrace rights' },
        { label: 'Possession', value: 'Ready to move' },
      ],
      gallery: [
        { image: media['terrace'], caption: 'The roof terrace' },
        { image: media['facade-upper'], caption: 'Arched terrace level' },
        { image: media['bedroom-suite'], caption: 'Bedroom suite' },
      ],
    },
    {
      title: 'Builder Floor, Lajpat Nagar III',
      slug: 'builder-floor-lajpat-nagar-3',
      locality: 'Lajpat Nagar',
      propertyType: 'builder-floor',
      listingType: 'sale',
      availability: 'under-construction',
      configuration: '3 BHK',
      area: '1,650 sq ft',
      floor: 'First of four',
      facing: 'West',
      price: '₹ 2.95 Cr',
      priceNote: 'Pre-launch pricing',
      featured: true,
      heroImage: media['facade-approach'],
      description: rt([
        'A first-floor unit in a four-floor rebuild now at structure stage, offered at pre-launch terms with a defined specification schedule and quarterly stage payments.',
        'Lajpat Nagar III sits minutes from the Ring Road and the markets, and its rebuilt stock has become the entry point for buyers priced out of the K-blocks further south.',
        'This is a sample listing seeded for demonstration. Replace it with live inventory through the admin panel.',
      ]),
      highlights: [
        { text: 'Structure complete, possession schedule in writing' },
        { text: 'Specification schedule annexed to the agreement' },
      ],
      amenities: [{ name: 'Lift' }, { name: 'Stilt parking' }, { name: 'Power backup' }],
      specifications: [
        { label: 'Configuration', value: '3 bedrooms, 3 baths' },
        { label: 'Built-up area', value: '1,650 sq ft (approx.)' },
        { label: 'Possession', value: 'Under construction' },
      ],
      gallery: [
        { image: media['living'], caption: 'Show flat: living room' },
        { image: media['kitchen-island'], caption: 'Show flat: kitchen' },
      ],
    },
    {
      title: 'Pre-Owned Floor, Jangpura Extension',
      slug: 'pre-owned-floor-jangpura-extension',
      locality: 'Jangpura',
      propertyType: 'pre-owned-floor',
      listingType: 'sale',
      availability: 'available',
      configuration: '3 BHK',
      area: '1,800 sq ft',
      floor: 'Ground with lawn',
      facing: 'South',
      price: '₹ 3.60 Cr',
      priceNote: 'All inclusive',
      featured: false,
      heroImage: media['living'],
      description: rt([
        'A well-kept ground floor from a 2016 rebuild, with a private front lawn and the deeper plot dimensions Jangpura Extension is valued for. Sold with clear title and mutation completed.',
        'This is a sample listing seeded for demonstration. Replace it with live inventory through the admin panel.',
      ]),
      highlights: [
        { text: 'Private front lawn' },
        { text: 'Mutation completed, single owner since 2016' },
      ],
      amenities: [{ name: 'Private lawn' }, { name: 'Covered parking' }, { name: 'Power backup' }],
      specifications: [
        { label: 'Configuration', value: '3 bedrooms, 3 baths' },
        { label: 'Built-up area', value: '1,800 sq ft (approx.)' },
        { label: 'Possession', value: 'Ready to move' },
      ],
      gallery: [{ image: media['bedroom'], caption: 'Principal bedroom' }],
    },
    {
      title: 'Builder Floor, Vinobapuri',
      slug: 'builder-floor-vinobapuri',
      locality: 'Vinobapuri',
      propertyType: 'builder-floor',
      listingType: 'rent',
      availability: 'available',
      configuration: '3 BHK',
      area: '1,500 sq ft',
      floor: 'Third of four',
      facing: 'East',
      price: '₹ 85,000 / month',
      priceNote: 'Company lease preferred',
      featured: false,
      heroImage: media['bedroom-suite'],
      description: rt([
        'A bright third-floor rental in a quiet Vinobapuri lane, freshly painted with wardrobes and modular kitchen in place. Available on a two-year lease.',
        'This is a sample listing seeded for demonstration. Replace it with live inventory through the admin panel.',
      ]),
      highlights: [{ text: 'Freshly painted, ready wardrobes' }, { text: 'Two-wheeler and one car parking' }],
      amenities: [{ name: 'Lift' }, { name: 'Parking' }, { name: 'Power backup' }],
      specifications: [
        { label: 'Configuration', value: '3 bedrooms, 2 baths' },
        { label: 'Built-up area', value: '1,500 sq ft (approx.)' },
        { label: 'Lease', value: '2 years, company lease preferred' },
      ],
      gallery: [{ image: media['kitchen-wide'], caption: 'Kitchen' }],
    },
    {
      title: 'Office Floor, Nehru Place District Centre',
      slug: 'office-floor-nehru-place',
      locality: 'Nehru Place',
      propertyType: 'office-space',
      listingType: 'rent',
      availability: 'available',
      configuration: 'Open plan',
      area: '4,600 sq ft',
      floor: 'Fourth, two lifts',
      facing: 'North',
      price: '₹ 3.45 Lakh / month',
      priceNote: 'Fit-out assistance available',
      featured: false,
      heroImage: media['facade-upper'],
      description: rt([
        'An open-plan commercial floor with two passenger lifts, 100% power backup and column spacing that seats roughly sixty. A2S can quote the interior fit-out under the same engagement.',
        'This is a sample listing seeded for demonstration. Replace it with live inventory through the admin panel.',
      ]),
      highlights: [{ text: 'Two passenger lifts, dedicated goods access' }, { text: 'Turnkey fit-out available under one contract' }],
      amenities: [{ name: 'Two lifts' }, { name: '100% power backup' }, { name: 'Visitor parking' }],
      specifications: [
        { label: 'Carpet area', value: '4,600 sq ft (approx.)' },
        { label: 'Floor', value: 'Fourth of eight' },
        { label: 'Availability', value: 'Immediate' },
      ],
      gallery: [],
    },
  ]
  for (const p of properties) {
    await payload.create({
      collection: 'properties',
      draft: false,
      data: { ...p, _status: 'published' } as never,
    })
  }

  payload.logger.info('Seeding blog posts...')
  const posts = [
    {
      title: 'A Buyer’s Guide to South Delhi Builder Floors',
      slug: 'buyers-guide-south-delhi-builder-floors',
      category: catGuides.id,
      featuredImage: media['facade-dusk'],
      excerpt:
        'What a builder floor actually is, how the K-blocks differ from the extensions, and the questions worth asking before you shortlist.',
      author: 'A2S Estates',
      publishedDate: '2026-08-01T00:00:00.000Z',
      tags: [{ tag: 'Builder floors' }, { tag: 'Buying' }],
      content: rt([
        'A builder floor is a single residence occupying one full floor of a low-rise plot, usually one of four, with a stilt for parking and, increasingly, a lift. You own your floor outright along with a proportionate share of the land beneath it.',
        { text: 'Why South Delhi took to the format', heading: 'h2' },
        'The colonies of South Delhi were laid out as plotted developments, and as original houses age, rebuilding a plot into four floors lets one family’s land become four families’ homes without the compromises of apartment living: no common corridors, no shared walls, your own front door at your own level.',
        { text: 'What separates a good floor from an average one', heading: 'h2' },
        'Structure and paperwork matter more than finishes. Look at the sanction plan against what was actually built, the width of the internal staircase, the make of the lift, the waterproofing detail on the terrace, and whether the stilt parking allocation is written into your agreement rather than assumed.',
        { text: 'The questions to ask before shortlisting', heading: 'h2' },
        'Ask who holds the title and whether mutation is complete. Ask for the lift’s service contract. Ask how the roof rights are divided. Ask what the rebuild’s specification schedule promised, and walk the finished floor against it. A good broker will have these answers before you ask; that is the standard we hold ourselves to.',
      ]),
    },
    {
      title: 'Freehold, Registry and the Paper Trail: Documents to Check Before You Buy',
      slug: 'documents-to-check-before-you-buy',
      category: catGuides.id,
      featuredImage: media['balcony-window'],
      excerpt:
        'Title, mutation, sanction plan, occupancy and the agreement itself: the five sets of paper that decide whether a deal is safe.',
      author: 'A2S Estates',
      publishedDate: '2026-07-10T00:00:00.000Z',
      tags: [{ tag: 'Documentation' }, { tag: 'Buying' }],
      content: rt([
        'Most difficulties in Delhi property deals trace back to paperwork that was assumed rather than read. Before money moves, five sets of documents deserve unhurried attention.',
        { text: '1. The chain of title', heading: 'h2' },
        'Trace ownership backwards through each registered sale deed until the chain closes cleanly. Gaps, unregistered links or general-power-of-attorney transfers are where risk hides.',
        { text: '2. Mutation', heading: 'h2' },
        'Mutation records the current owner in the municipal record. It does not create title, but its absence complicates everything that follows, from utility connections to resale.',
        { text: '3. The sanction plan', heading: 'h2' },
        'Compare the sanctioned drawings with the building as it stands. Deviations are common; what matters is whether they are regularisable and who bears that cost.',
        { text: '4. Dues and encumbrances', heading: 'h2' },
        'Property tax receipts, electricity and water dues, and a search for registered mortgages or lis pendens. An encumbrance certificate is inexpensive insurance.',
        { text: '5. The agreement itself', heading: 'h2' },
        'Possession dates, specification schedules, parking allocation, roof rights and penalty clauses belong in writing. If a term was promised in conversation, it belongs in the agreement.',
        'A2S coordinates this diligence with empanelled lawyers as part of every purchase mandate, so the paperwork is settled before the negotiation concludes, not after.',
      ]),
    },
    {
      title: 'Why Lift Planning Should Start Before the First Slab',
      slug: 'lift-planning-builder-floors',
      category: catMarket.id,
      featuredImage: media['facade-upper'],
      excerpt:
        'The lift has become the deciding amenity in builder floor resale. Getting the shaft, the machine and the service contract right costs far less at design stage.',
      author: 'A2S Estates',
      publishedDate: '2026-06-05T00:00:00.000Z',
      tags: [{ tag: 'Elevators' }, { tag: 'Construction' }],
      content: rt([
        'Ten years ago a lift in a four-floor rebuild was a luxury; today its absence discounts the upper floors materially. Yet lifts are still routinely treated as a line item to be resolved late, which is how narrow shafts, undersized machines and orphaned service contracts happen.',
        { text: 'Decisions that belong at design stage', heading: 'h2' },
        'Shaft position decides the floor plan around it. Shaft dimensions decide which machines fit, and machine-room-less designs have their own clearances. Power provisioning, backup integration and drainage at the pit level are simple in drawings and expensive in concrete.',
        { text: 'Modernisation of existing buildings', heading: 'h2' },
        'For standing buildings, modernisation ranges from replacing the controller and doors to a full machine swap in the existing shaft. The right scope depends on the building’s wiring, the shaft’s true plumb, and how the residents share cost, and it starts with a survey rather than a brochure.',
        'A2S advises on shaft planning for new rebuilds and coordinates comparable quotes for modernisation, with the service contract negotiated alongside the machine.',
      ]),
    },
  ]
  for (const p of posts) {
    await payload.create({
      collection: 'posts',
      draft: false,
      data: { ...p, _status: 'published' } as never,
    })
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

void run()
