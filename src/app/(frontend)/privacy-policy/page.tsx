import type { Metadata } from 'next'

import { phoneNumbers } from '@/lib/contact'
import { getSiteSettings } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How A2S Estates collects, uses, stores and protects the personal information you share through this website.',
  alternates: { canonical: '/privacy-policy' },
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings()
  const address = settings.address
  const phones = phoneNumbers(settings)
  const email = settings.email

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
              This policy explains what personal information A2S Estates collects through this
              website, why we collect it, and the choices you have. It applies to this website only.
            </p>

            <h2>Information we collect</h2>
            <p>
              We collect the details you choose to give us when you submit an enquiry: your first
              and last name, email address, phone number, your message, and the property the enquiry
              relates to, if you enquired from a property page. We also record whether you accepted
              the consent statement on the form.
            </p>
            <p>
              We do not ask for financial information, identity documents or any other sensitive
              personal data through this website. If a transaction later requires such documents, we
              will collect them directly from you outside this website and tell you why they are
              needed.
            </p>

            <h2>How we use it</h2>
            <p>
              Your details are used to respond to your enquiry, to arrange site visits, and to send
              you property options and information relevant to what you asked about. Where you have
              consented, we may contact you by phone, WhatsApp or email for these purposes.
            </p>
            <p>
              We do not sell your personal information, and we do not share it with third parties for
              their own marketing.
            </p>

            <h2>Sharing</h2>
            <p>
              We share your details only where it is necessary to act on your enquiry, for example
              with a property owner or their representative when arranging a viewing, or with
              professional advisers such as lawyers or lenders when you have asked us to coordinate
              that work. We also share information where the law requires it.
            </p>

            <h2>Storage and retention</h2>
            <p>
              Enquiries are stored in this website&rsquo;s content management system and are
              accessible only to authorised A2S Estates staff. We keep them for as long as needed to
              serve your enquiry and to meet our legal and record-keeping obligations, after which
              they are deleted.
            </p>

            <h2>Cookies</h2>
            <p>
              This website does not use advertising or tracking cookies. A cookie is set only when a
              member of the A2S Estates team signs in to the administration area, and it exists
              solely to keep that person signed in.
            </p>

            <h2>Your choices</h2>
            <p>
              You may ask us at any time to tell you what information we hold about you, to correct
              it, or to delete it. You may also withdraw your consent to being contacted. Write to us
              using the details below and we will act on your request.
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
