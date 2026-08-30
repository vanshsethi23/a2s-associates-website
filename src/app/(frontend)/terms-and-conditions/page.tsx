import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms on which the A2S Estates website and its content are provided.',
  alternates: { canonical: '/terms-and-conditions' },
  robots: { index: false },
}

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="label">Legal</span>
          <h1>Terms &amp; Conditions</h1>
        </div>
      </section>
      <section className="section bg-bone">
        <div className="container">
          <div className="rich-text" style={{ marginInline: 0 }}>
            <p>
              <strong>Placeholder document.</strong> These terms are a working draft prepared for the
              launch of this website. They must be reviewed and approved by A2S Estates and its
              legal counsel before the site goes live.
            </p>
            <h2>Information on this website</h2>
            <p>
              Property particulars, areas, prices and availability are indicative, published in good
              faith, and do not constitute an offer or contract. All figures are subject to
              verification on site and confirmation in writing.
            </p>
            <h2>No professional advice</h2>
            <p>
              Content on this website, including articles in the News &amp; Blogs section, is general
              information and not legal, tax or investment advice. Obtain independent professional
              advice before acting on it.
            </p>
            <h2>Intellectual property</h2>
            <p>
              The A2S Estates name, logo, photography and written content on this site may not be
              reproduced without written permission.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
