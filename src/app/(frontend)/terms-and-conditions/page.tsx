import type { Metadata } from 'next'

import { phoneNumbers } from '@/lib/contact'
import { getSiteSettings } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms on which the A2S Estates website and the information published on it are provided.',
  alternates: { canonical: '/terms-and-conditions' },
}

export default async function TermsPage() {
  const settings = await getSiteSettings()
  const address = settings.address
  const phones = phoneNumbers(settings)
  const email = settings.email

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
              These terms govern your use of the A2S Estates website. By using the site you accept
              them.
            </p>

            <h2>Information on this website</h2>
            <p>
              Property particulars, areas, floor levels, prices, availability and status are
              published in good faith and are indicative only. They do not form an offer or a
              contract, and they may change without notice. Areas are approximate and prices are
              subject to negotiation and confirmation by the owner.
            </p>
            <p>
              Verify every material fact on site and in writing before you commit to a transaction.
              Nothing shown here replaces your own inspection, survey and legal due diligence.
            </p>

            <h2>Images and visualisations</h2>
            <p>
              Photographs, films and renders are for illustration. Some imagery is
              computer-generated and shows an indicative finish rather than a specific property as
              built. Furnishings shown are not included unless stated in writing.
            </p>

            <h2>No professional advice</h2>
            <p>
              Content on this website, including articles in the News &amp; Blogs section, is general
              information and is not legal, tax, financial or investment advice. Obtain independent
              professional advice before acting on anything you read here.
            </p>

            <h2>Enquiries</h2>
            <p>
              Submitting an enquiry does not reserve a property or create any obligation on either
              side. Any engagement of A2S Estates, and the fees for it, will be agreed separately in
              writing.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The A2S Estates name, logo, photography, films and written content on this site belong
              to A2S Estates or its licensors and may not be copied, republished or used
              commercially without our written permission.
            </p>

            <h2>Third-party links</h2>
            <p>
              Where this site links to other websites, we do not control them and are not
              responsible for their content or their privacy practices.
            </p>

            <h2>Liability</h2>
            <p>
              We take care to keep this website accurate and available, but we do not warrant that it
              is error-free or uninterrupted. To the extent permitted by law, A2S Estates is not
              liable for loss arising from reliance on information published here that has not been
              independently verified.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of India, and the courts at New Delhi have
              exclusive jurisdiction over any dispute arising from them.
            </p>

            <h2>Contact</h2>
            <p>
              A2S Estates
              {address ? (
                <>
                  <br />
                  {address}
                </>
              ) : null}
              {phones.map((number) => (
                <span key={number}>
                  <br />
                  {number}
                </span>
              ))}
              {email ? (
                <>
                  <br />
                  <a href={`mailto:${email}`}>{email}</a>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
