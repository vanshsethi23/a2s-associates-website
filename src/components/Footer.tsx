import Image from 'next/image'
import Link from 'next/link'

import { phoneNumbers, telHref } from '@/lib/contact'
import type { SiteSetting } from '@/payload-types'

const QUICK_LINKS = [
  { label: 'South Delhi Builder Floors', href: '/properties?type=builder-floor' },
  { label: 'Builder Floors in Lajpat Nagar', href: '/properties?locality=lajpat-nagar' },
  { label: 'Builder Floors in Vinobapuri', href: '/properties?locality=vinobapuri' },
  { label: 'Builder Floors in Jangpura', href: '/properties?locality=jangpura' },
  { label: 'Builder Floors in GK', href: '/properties?locality=greater-kailash' },
  { label: 'Builder Floors in Kailash Colony', href: '/properties?locality=kailash-colony' },
]

const EXPLORE = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'All Properties', href: '/properties' },
  { label: 'News & Blogs', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  const name = settings.copyrightName || 'A2S Estates'
  const address = settings.address
  const phones = phoneNumbers(settings)
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="A2S Estates home">
              <Image
                src="/brand/logo-vertical-dark.png"
                alt="A2S Estates. Sale, purchase, renting and collaboration."
                width={640}
                height={508}
                style={{ height: 110, width: 'auto' }}
              />
            </Link>
            <p>
              Sale, purchase, renting and collaboration across South Delhi, with turnkey design and
              construction under the same roof.
            </p>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3>Reach Us</h3>
            <address>
              {address ? (
                <>
                  {address}
                  <br />
                </>
              ) : null}
              {phones.map((number) => (
                <span key={number}>
                  <a href={telHref(number)}>{number}</a>
                  <br />
                </span>
              ))}
              {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
              {settings.officeHours ? (
                <>
                  <br />
                  {settings.officeHours}
                </>
              ) : null}
            </address>
          </div>
        </div>
        <div className="footer-legal">
          <span>
            Copyright © {year} {name}, All Rights Reserved
          </span>
          <nav aria-label="Legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
