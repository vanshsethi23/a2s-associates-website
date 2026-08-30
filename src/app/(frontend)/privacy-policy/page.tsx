import type { Metadata } from 'next'

import { getSiteSettings } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How A2S Estates collects, uses and protects the personal information you share with us.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: false },
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings()
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="label">Legal</span>
          <h1>Privacy Policy</h1>
        </div>
      </section>
      <section className="section bg-bone">
        <div className="container">
          <div className="rich-text" style={{ marginInline: 0 }}>
            <p>
              <strong>Placeholder document.</strong> This policy is a working draft prepared for the
              launch of this website. It must be reviewed and approved by A2S Estates and its legal
              counsel before the site goes live.
            </p>
            <h2>What we collect</h2>
            <p>
              When you submit an enquiry we collect the details you provide: your name, email
              address, phone number and message, together with the property the enquiry relates to.
            </p>
            <h2>How we use it</h2>
            <p>
              We use these details solely to respond to your enquiry and, where you have consented,
              to contact you about properties and services relevant to it. We do not sell personal
              information.
            </p>
            <h2>Storage and retention</h2>
            <p>
              Enquiries are stored in the website&rsquo;s content management system, accessible only to
              authorised A2S Estates staff, and retained only as long as needed to serve the
              enquiry and meet legal obligations.
            </p>
            <h2>Your choices</h2>
            <p>
              You may ask us at any time to correct or delete the information we hold about you by
              writing to {settings.email || 'the email address published on our contact page'}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
