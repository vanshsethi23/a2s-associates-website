import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { SERVICE_FAQS } from '@/lib/faqs'
import { ORG_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, jsonLdGraph, jsonLdScript } from '@/lib/seo'
import { SERVICES } from '@/lib/services'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Property consulting, sale, purchase and renting of builder and pre-owned floors, office spaces, turnkey interior design and construction, elevator planning and modernisation, home loan and documentation assistance, and post-possession support in South Delhi.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
    faqJsonLd(SERVICE_FAQS),
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/services#webpage`,
      url: `${SITE_URL}/services`,
      name: 'Services · A2S Estates',
      about: { '@id': ORG_ID },
      inLanguage: 'en-IN',
    },
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <section className="page-hero">
        <div className="container">
          <span className="label">Services</span>
          <h1>
            Eight disciplines. One <em style={{ lineHeight: 1.12 }}>engagement.</em>
          </h1>
          <p>
            Everything below is delivered by A2S itself, not referred out. Engage one service or the
            whole chain; the accountability is the same.
          </p>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container">
          {SERVICES.map((s) => (
            <Reveal key={s.id} delay={0.04}>
              <article
                id={s.id}
                className="why-item"
                style={{ scrollMarginTop: 'calc(var(--header-h) + 1.5rem)', padding: '2.6rem 0' }}
              >
                <h3 style={{ fontSize: '1.5rem', maxWidth: '11ch' }}>{s.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {s.long.map((p, j) => (
                    <p key={j} style={{ maxWidth: '62ch' }}>
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-stone" aria-labelledby="faq-heading">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <h2 id="faq-heading" className="display" style={{ fontSize: 'var(--text-display)' }}>
                Questions we are asked often.
              </h2>
            </Reveal>
          </div>
          <div className="faq-list">
            {SERVICE_FAQS.map((faq, i) => (
              <Reveal key={faq.question} delay={(i % 3) * 0.05}>
                <details className="faq-item" name="service-faq">
                  <summary>
                    <h3>{faq.question}</h3>
                    <span className="faq-marker" aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight on-dark deep">
        <div className="container cta-band">
          <h2 className="display inv" style={{ fontSize: 'var(--text-display-s)' }}>
            Not sure which service fits? Describe the situation instead.
          </h2>
          <Link href="/contact#enquiry" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
