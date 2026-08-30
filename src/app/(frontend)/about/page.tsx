import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'A2S Estates is a South Delhi real-estate firm carrying properties from search to finished room: sale, purchase, renting, collaboration, turnkey interiors and construction under one accountable roof.',
  alternates: { canonical: '/about' },
}

const VALUES = [
  {
    title: 'Accountability',
    body: 'One firm answers for the search, the paperwork and the finish. When something needs fixing, you know whose phone to ring, and it is answered.',
  },
  {
    title: 'Candour',
    body: 'The realistic price, the defect in the title, the compromise in the floor plan: you hear it from us first, in writing, while it can still shape your decision.',
  },
  {
    title: 'Craft',
    body: 'We build and fit out what we sell, so we judge properties the way a builder does: structure, services and finish before staging and photographs.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="label">About Us</span>
          <h1>
            The distance between an address and a <em style={{ lineHeight: 1.12 }}>home.</em>
          </h1>
          <p>
            A2S Estates was founded on a simple observation: in South Delhi, finding a property and
            actually living or working in it are separated by months of fragmented, unaccountable
            work. We closed that gap by putting every discipline under one roof.
          </p>
        </div>
      </section>

      <section className="section bg-stone">
        <div className="container why-grid">
          <div className="why-sticky">
            <Reveal>
              <h2 className="display">Our Vision</h2>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <p className="lede" style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display-stack)', fontWeight: 380, color: 'var(--text-strong)', lineHeight: 1.5 }}>
              To be the firm South Delhi trusts with its most personal asset: the standard others are
              measured against for straight dealing, clean paperwork and finished spaces that honour
              what was promised.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container why-grid">
          <div className="why-sticky">
            <Reveal>
              <h2 className="display">Our Mission</h2>
            </Reveal>
          </div>
          <div>
            <Reveal delay={0.08}>
              <p className="lede">
                To close the gap between finding a property and living or working in it: one
                accountable engagement that carries sale, purchase, renting and collaboration through
                consulting, documentation, construction and the mechanical fit-out, with every
                commitment recorded in writing.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="image-band">
        <Image
          src="/stills/terrace-wide.webp"
          alt="Landscaped roof terrace of a South Delhi builder floor at golden hour"
          width={1600}
          height={900}
          sizes="100vw"
          loading="lazy"
        />
      </div>

      <section className="section bg-stone" aria-labelledby="values-heading">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <h2 id="values-heading" className="display">
                Our Core Values
              </h2>
            </Reveal>
          </div>
          <div className="value-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="value-item">
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight on-dark deep">
        <div className="container cta-band">
          <h2 className="display inv" style={{ fontSize: 'var(--text-display-s)' }}>
            Work with a firm that finishes what it starts.
          </h2>
          <Link href="/contact#enquiry" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
