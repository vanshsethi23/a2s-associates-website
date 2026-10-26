import { getSiteSettings } from '@/lib/data'

/**
 * Links out to the firm's listing portal profile.
 *
 * The URL lives in Site Settings, so clearing that one field removes every
 * instance of this across the site. `getSiteSettings` is request-cached, so
 * each page still reads the global once however many times this appears.
 *
 * Placement differs by context rather than repeating one block: pages that
 * already close with a "Get in touch" band take the link as a second,
 * quieter action, while pages about browsing get a band of their own.
 */
const LABEL = 'Explore available properties'
const ARIA = `${LABEL} on Housing.com (opens in a new tab)`

export async function PortalLink({ variant = 'ghost' }: { variant?: 'ghost' | 'primary' }) {
  const settings = await getSiteSettings()
  const url = settings.portalUrl?.trim()
  if (!url) return null

  return (
    <a
      href={url}
      className={`btn btn-${variant}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA}
    >
      {LABEL}
    </a>
  )
}

export async function PortalBand({ heading }: { heading: string }) {
  const settings = await getSiteSettings()
  if (!settings.portalUrl?.trim()) return null

  return (
    <section className="section-tight on-dark deep">
      <div className="container cta-band">
        <h2 className="display inv" style={{ fontSize: 'var(--text-display-s)' }}>
          {heading}
        </h2>
        <PortalLink variant="primary" />
      </div>
    </section>
  )
}
