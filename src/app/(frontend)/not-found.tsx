import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '70dvh' }}>
      <div className="container">
        <span className="label">Page not found</span>
        <h1>
          This address does not <em style={{ lineHeight: 1.12 }}>exist.</em>
        </h1>
        <p>The page you are looking for has moved or never was. The properties, however, are very real.</p>
        <p style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn btn-primary">
            Back to the home page
          </Link>
        </p>
      </div>
    </section>
  )
}
