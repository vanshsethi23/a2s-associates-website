import type { Metadata, Viewport } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { phoneNumbers } from '@/lib/contact'
import { getSiteSettings } from '@/lib/data'
import { fraunces, plexMono, plexSans } from '@/lib/fonts'
import { SITE_URL, jsonLdGraph, jsonLdScript, organizationJsonLd, websiteJsonLd } from '@/lib/seo'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'A2S Estates · South Delhi Builder Floors, Sale, Purchase, Renting & Collaboration',
    template: '%s · A2S Estates',
  },
  description:
    'A2S Estates is a South Delhi real-estate firm handling sale, purchase, renting and collaboration of builder floors, pre-owned floors and office spaces, with turnkey interior design and construction under one roof.',
  icons: {
    icon: [
      { url: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/brand/icon-192.png' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'A2S Estates',
    locale: 'en_IN',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'A2S Estates, South Delhi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A2S Estates · South Delhi Builder Floors',
    description:
      'Sale, purchase, renting and collaboration of builder floors, pre-owned floors and office spaces across South Delhi, with turnkey interiors and construction.',
    images: ['/og-home.jpg'],
  },
  alternates: { canonical: '/' },
  category: 'Real Estate',
  authors: [{ name: 'A2S Estates', url: SITE_URL }],
  creator: 'A2S Estates',
  publisher: 'A2S Estates',
  formatDetection: { telephone: true, address: true, email: true },
}

export const viewport: Viewport = {
  themeColor: '#141311',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  // One entity graph for the whole site: every page inherits the same
  // Organization and WebSite nodes, so engines resolve them to one business.
  const siteGraph = jsonLdGraph(organizationJsonLd(settings), websiteJsonLd())

  return (
    <html lang="en-IN" className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(siteGraph) }}
        />
        {/* Scroll reveals need JavaScript to trigger; without it, show everything. */}
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header phones={phoneNumbers(settings)} email={settings.email} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
