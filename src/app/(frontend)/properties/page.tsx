import type { Metadata } from 'next'
import Link from 'next/link'

import { PropertyCard } from '@/components/PropertyCard'
import { Reveal } from '@/components/Reveal'
import { getProperties } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'All Properties',
  description:
    'Builder floors, pre-owned floors, office spaces and collaboration plots currently represented by A2S Estates across South Delhi.',
  alternates: { canonical: '/properties' },
}

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'builder-floor', label: 'Builder floors' },
  { key: 'pre-owned-floor', label: 'Pre-owned floors' },
  { key: 'office-space', label: 'Office spaces' },
  { key: 'rent', label: 'For rent' },
  { key: 'sale', label: 'For sale' },
]

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; locality?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const result = await getProperties({ type: params.type, locality: params.locality, page, limit: 12 })
  const localityLabel = params.locality ? params.locality.replace(/-/g, ' ') : null

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="label">All Property</span>
          <h1>
            The floors on our <em style={{ lineHeight: 1.12 }}>books.</em>
          </h1>
          <p>
            Every listing is walked, papered and priced by us before it appears here. If the brief
            you have in mind is not below, ask: much of what we transact never reaches the website.
          </p>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container">
          <nav className="filter-bar" aria-label="Filter properties">
            {FILTERS.map((f) => {
              const active = (params.type || '') === f.key
              return (
                <Link
                  key={f.key}
                  href={f.key ? `/properties?type=${f.key}` : '/properties'}
                  className={`filter-chip${active ? ' is-active' : ''}`}
                  aria-current={active ? 'true' : undefined}
                >
                  {f.label}
                </Link>
              )
            })}
          </nav>

          {localityLabel ? (
            <p style={{ marginBottom: '2rem' }}>
              Showing properties in <strong style={{ color: 'var(--text-strong)', textTransform: 'capitalize' }}>{localityLabel}</strong>.{' '}
              <Link href="/properties" className="text-link">
                Clear
              </Link>
            </p>
          ) : null}

          {result.docs.length > 0 ? (
            <div className="prop-grid">
              {result.docs.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.07}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div style={{ padding: '4rem 0', maxWidth: '52ch' }}>
              <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '1rem' }}>
                Nothing listed under this filter right now.
              </h2>
              <p>
                Much of our inventory moves before it is published. Tell us the brief and we will
                send what fits, in writing.
              </p>
              <p style={{ marginTop: '1.5rem' }}>
                <Link href="/contact#enquiry" className="btn btn-primary">
                  Get in touch
                </Link>
              </p>
            </div>
          )}

          {result.totalPages > 1 ? (
            <nav className="pagination" aria-label="Pagination">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span key={n} className="current" aria-current="page">
                    {n}
                  </span>
                ) : (
                  <Link key={n} href={`/properties?${new URLSearchParams({ ...(params.type ? { type: params.type } : {}), page: String(n) })}`}>
                    {n}
                  </Link>
                ),
              )}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  )
}
