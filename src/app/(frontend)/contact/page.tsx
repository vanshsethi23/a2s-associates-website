import type { Metadata } from 'next'

import { EnquiryForm } from '@/components/EnquiryForm'
import { Reveal } from '@/components/Reveal'
import { phoneNumbers, telHref } from '@/lib/contact'
import { getSiteSettings } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Reach A2S Estates: address, phone and email, and an enquiry form answered in writing within one working day.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const address = settings.address
  const phones = phoneNumbers(settings)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="label">Contact Us</span>
          <h1>
            Start with the <em style={{ lineHeight: 1.12 }}>brief.</em>
          </h1>
          <p>
            The locality, the budget, and what the space needs to do. We reply in writing within one
            working day.
          </p>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container contact-grid">
          <div>
            <Reveal>
              <h2 className="display" style={{ fontSize: 'var(--text-display-s)', marginBottom: '1.5rem' }}>
                Reach us
              </h2>
            </Reveal>
            <div className="contact-list">
              {address ? (
                <div className="contact-item">
                  <span className="k">Address</span>
                  <span className="v">{address}</span>
                </div>
              ) : null}
              {phones.length > 0 ? (
                <div className="contact-item">
                  <span className="k">{phones.length > 1 ? 'Phone numbers' : 'Phone'}</span>
                  {phones.map((number) => (
                    <a key={number} className="v" href={telHref(number)}>
                      {number}
                    </a>
                  ))}
                </div>
              ) : null}
              {settings.email ? (
                <div className="contact-item">
                  <span className="k">Email</span>
                  <a className="v" href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </div>
              ) : null}
              {settings.officeHours ? (
                <div className="contact-item">
                  <span className="k">Hours</span>
                  <span className="v">{settings.officeHours}</span>
                </div>
              ) : null}
              {settings.whatsapp ? (
                <div className="contact-item">
                  <span className="k">WhatsApp</span>
                  <a className="v" href={`https://wa.me/${settings.whatsapp}`} rel="noopener noreferrer" target="_blank">
                    Message us on WhatsApp
                  </a>
                </div>
              ) : null}
            </div>
            {settings.mapEmbedUrl ? (
              <div style={{ marginTop: '2rem', aspectRatio: '4 / 3' }}>
                <iframe
                  src={settings.mapEmbedUrl}
                  title="Map to the A2S Estates office"
                  style={{ width: '100%', height: '100%', border: 0, borderRadius: 'var(--radius)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>

          <div id="enquiry" style={{ scrollMarginTop: 'calc(var(--header-h) + 1.5rem)' }}>
            <Reveal>
              <h2 className="display" style={{ fontSize: 'var(--text-display-s)', marginBottom: '1.8rem' }}>
                Get in touch with us
              </h2>
            </Reveal>
            <EnquiryForm consentText={settings.consentText || ''} />
          </div>
        </div>
      </section>
    </>
  )
}
