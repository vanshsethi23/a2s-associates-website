import Image from 'next/image'
import Link from 'next/link'

import { CinematicHero } from '@/components/CinematicHero'
import { PostCard } from '@/components/PostCard'
import { PropertyCard } from '@/components/PropertyCard'
import { Reveal } from '@/components/Reveal'
import { getFeaturedProperties, getPosts, getSiteSettings } from '@/lib/data'
import { SERVICES } from '@/lib/services'

export const revalidate = 3600

const WHY = [
  {
    title: 'One firm, end to end',
    body: 'Most transactions juggle a broker, a consultant, a contractor and a lift vendor. At A2S the same firm carries the property from search through paperwork, construction and fit-out, so accountability never changes hands.',
  },
  {
    title: 'South Delhi, street by street',
    body: 'Builder floors, pre-owned floors and office spaces in the colonies we walk daily: Greater Kailash, Kailash Colony, Lajpat Nagar, Jangpura, Vinobapuri and their neighbours.',
  },
  {
    title: 'Paper before money',
    body: 'Title, mutation, sanction plan and agreement are checked before a rupee moves. Every brief, shortlist and negotiation position is put in writing.',
  },
  {
    title: 'Built as well as brokered',
    body: 'Turnkey interiors, construction and lift planning sit inside the firm. We know what a floor costs to finish properly, and it shows in how we value one.',
  },
]

export default async function HomePage() {
  const [properties, posts, settings] = await Promise.all([
    getFeaturedProperties(3),
    getPosts({ limit: 3 }),
    getSiteSettings(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'A2S Estates',
    slogan: 'Ambition to Success',
    areaServed: 'South Delhi, New Delhi, India',
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address, addressRegion: 'Delhi', addressCountry: 'IN' }
      : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CinematicHero />

      {/* editorial introduction */}
      <section className="section bg-stone">
        <div className="container intro-grid">
          <Reveal>
            <h2 className="display">
              A South Delhi firm for people who expect the property, the paperwork and the finish to
              be handled with <em>equal seriousness.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="intro-aside">
            <p className="lede">
              A2S Estates handles sale, purchase, renting and collaboration of builder floors,
              pre-owned floors and office spaces, and finishes what it sells: turnkey interiors,
              construction and lift planning under the same roof.
            </p>
            <Link href="/about" className="text-link">
              About the firm
            </Link>
          </Reveal>
        </div>
      </section>

      {/* why A2S */}
      <section className="section bg-bone" aria-labelledby="why-heading">
        <div className="container why-grid">
          <div className="why-sticky">
            <Reveal>
              <span className="label">Why A2S Associates</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="why-heading" className="display">
                Four reasons clients stay for the <em>second deal.</em>
              </h2>
            </Reveal>
          </div>
          <div>
            {WHY.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="why-item">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* what we do */}
      <section className="section on-dark" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <h2 id="services-heading" className="display inv">
                What we do.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="lede">
                Eight disciplines, one engagement. Every service below is delivered by the firm
                itself, not referred out.
              </p>
            </Reveal>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 0.06}>
                <Link href={`/services#${s.id}`} className="service-row">
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Reveal>
              <Link href="/services" className="text-link">
                The services in detail
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* featured properties */}
      {properties.length > 0 ? (
        <section className="section bg-bone" aria-labelledby="props-heading">
          <div className="container">
            <div className="section-head" style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', maxWidth: 'none', flexWrap: 'wrap', gap: '1.5rem' }}>
              <Reveal>
                <h2 id="props-heading" className="display" style={{ fontSize: 'var(--text-display)' }}>
                  On the books.
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <Link href="/properties" className="text-link">
                  All properties
                </Link>
              </Reveal>
            </div>
            <div className="prop-grid">
              {properties.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* film still band */}
      <div className="image-band">
        <Image
          src="/frames/poster.webp"
          alt="Dusk view of a classical four-storey builder floor behind its boundary wall"
          width={1920}
          height={1080}
          sizes="100vw"
          loading="lazy"
        />
      </div>

      {/* journal */}
      {posts.docs.length > 0 ? (
        <section className="section bg-stone" aria-labelledby="journal-heading">
          <div className="container">
            <div className="section-head" style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', maxWidth: 'none', flexWrap: 'wrap', gap: '1.5rem' }}>
              <Reveal>
                <h2 id="journal-heading" className="display" style={{ fontSize: 'var(--text-display)' }}>
                  Latest from the journal.
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <Link href="/blog" className="text-link">
                  News &amp; blogs
                </Link>
              </Reveal>
            </div>
            <div className="post-grid">
              {posts.docs.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* closing CTA */}
      <section className="section-tight on-dark deep">
        <div className="container cta-band">
          <Reveal>
            <h2 className="display inv" style={{ fontSize: 'var(--text-display-s)' }}>
              Tell us the brief. We will tell you what is possible.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', alignItems: 'flex-start' }}>
              <Link href="/contact#enquiry" className="btn btn-primary">
                Get in touch
              </Link>
              {settings.phone ? (
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} style={{ fontFamily: 'var(--font-mono-stack)', fontSize: '0.875rem', color: 'var(--text-inv-body)' }}>
                  {settings.phone}
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
