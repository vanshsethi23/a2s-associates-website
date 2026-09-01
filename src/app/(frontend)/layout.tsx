import type { Metadata, Viewport } from 'next'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { phoneNumbers } from '@/lib/contact'
import { getSiteSettings } from '@/lib/data'
import { fraunces, plexMono, plexSans } from '@/lib/fonts'

import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
  },
}

export const viewport: Viewport = {
  themeColor: '#141311',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
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
