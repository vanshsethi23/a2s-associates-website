import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EnquiryForm } from '@/components/EnquiryForm'
import { GalleryCarousel, type CarouselSlide } from '@/components/GalleryCarousel'
import { RichTextContent } from '@/components/RichTextContent'
import {
  AVAILABILITY_LABELS,
  PROPERTY_TYPE_LABELS,
  asMedia,
  getPropertyBySlug,
  getSiteSettings,
  mediaUrl,
} from '@/lib/data'
import { ORG_ID, SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdGraph, jsonLdScript } from '@/lib/seo'

export const revalidate = 3600

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  if (!property) return {}
  const hero = asMedia(property.heroImage)
  const og = mediaUrl(asMedia(property.seo?.ogImage) || hero, 'og')
  return {
    title: property.seo?.metaTitle || `${property.title} · ${property.locality}`,
    description:
      property.seo?.metaDescription ||
      `${PROPERTY_TYPE_LABELS[property.propertyType] || 'Property'} in ${property.locality}, ${property.location || 'South Delhi'}${property.configuration ? ` · ${property.configuration}` : ''}${property.area ? ` · ${property.area}` : ''}. Represented by A2S Estates.`,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: og ? { images: [{ url: og }] } : undefined,
  }
}

const embedUrl = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

export default async function PropertyDetailPage({ params }: Params) {
  const { slug } = await params
  const [property, settings] = await Promise.all([getPropertyBySlug(slug), getSiteSettings()])
  if (!property) notFound()

  const hero = asMedia(property.heroImage)
  const heroUrl = mediaUrl(hero, 'large')
  const gallery = (property.gallery || []).map((g) => ({ media: asMedia(g.image), caption: g.caption })).filter((g) => g.media)
  const strip = [
    property.configuration && { k: 'Configuration', v: property.configuration },
    property.area && { k: 'Area', v: property.area },
    property.floor && { k: 'Floor', v: property.floor },
    property.facing && { k: 'Facing', v: property.facing },
    { k: 'Price', v: property.price || 'On request' },
  ].filter(Boolean) as { k: string; v: string }[]
  const video = property.videoUrl ? embedUrl(property.videoUrl) : null
  const videoFile = asMedia(property.videoFile)
  const galleryUrls = gallery
    .map((g) => mediaUrl(g.media, 'large'))
    .filter((u): u is string => Boolean(u))
    .map(absoluteUrl)

  // Price is free text (e.g. "₹ 4.25 Cr", "₹ 85,000 / month") so it is only
  // published as a structured offer when a plain number can be read from it.
  const numericPrice = (() => {
    const raw = property.price || ''
    const m = raw.match(/([\d.,]+)\s*(Cr|Crore|Lakh|Lac)?/i)
    if (!m) return undefined
    const value = Number(m[1].replace(/,/g, ''))
    if (!Number.isFinite(value)) return undefined
    const unit = (m[2] || '').toLowerCase()
    if (unit.startsWith('cr')) return value * 10000000
    if (unit.startsWith('la')) return value * 100000
    return value
  })()

  const isRental = property.listingType === 'rent'
  const forSale = property.availability === 'available' || property.availability === 'under-construction'

  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Properties', path: '/properties' },
      { name: property.title, path: `/properties/${property.slug}` },
    ]),
    {
      '@type': 'RealEstateListing',
      '@id': `${SITE_URL}/properties/${property.slug}#listing`,
      url: `${SITE_URL}/properties/${property.slug}`,
      name: property.title,
      description: property.seo?.metaDescription || undefined,
      image: galleryUrls.length > 0 ? galleryUrls : heroUrl ? [absoluteUrl(heroUrl)] : undefined,
      datePosted: property.createdAt,
      provider: { '@id': ORG_ID },
      inLanguage: 'en-IN',
      about: {
        '@type': 'Accommodation',
        name: property.title,
        accommodationCategory: PROPERTY_TYPE_LABELS[property.propertyType] || undefined,
        numberOfRooms: property.configuration || undefined,
        floorLevel: property.floor || undefined,
        floorSize: property.area ? { '@type': 'QuantitativeValue', name: property.area } : undefined,
        amenityFeature: (property.amenities || []).map((a) => ({
          '@type': 'LocationFeatureSpecification',
          name: a.name,
        })),
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.locality,
          addressRegion: property.location || 'South Delhi',
          addressCountry: 'IN',
        },
      },
      ...(numericPrice
        ? {
            offers: {
              '@type': 'Offer',
              price: numericPrice,
              priceCurrency: 'INR',
              availability: forSale ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
              ...(isRental
                ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: numericPrice, priceCurrency: 'INR', unitCode: 'MON' } }
                : {}),
            },
          }
        : {}),
    },
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <section className="prop-hero">
        {heroUrl ? (
          <Image src={heroUrl} alt={hero?.alt || property.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        ) : null}
        <div className="prop-hero-scrim" aria-hidden="true" />
        <div className="container">
          <span className="label">
            {property.locality} · {PROPERTY_TYPE_LABELS[property.propertyType] || 'Property'}
            {property.availability && property.availability !== 'available'
              ? ` · ${AVAILABILITY_LABELS[property.availability]}`
              : ''}
          </span>
          <h1>{property.title}</h1>
        </div>
      </section>

      <div className="prop-strip">
        <div className="container">
          {strip.map((s) => (
            <div key={s.k} className="prop-strip-item">
              <span className="k">{s.k}</span>
              <span className="v">{s.v}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section bg-bone">
        <div className="container prop-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {property.description ? (
              <RichTextContent data={property.description} className="rich-text" />
            ) : null}

            {property.highlights && property.highlights.length > 0 ? (
              <div>
                <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '0.6rem' }}>
                  Highlights
                </h2>
                <ul className="highlight-list">
                  {property.highlights.map((h) => (
                    <li key={h.id}>{h.text}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {gallery.length > 0 ? (
              <div>
                <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '1.4rem' }}>
                  The residence in pictures
                </h2>
                <GalleryCarousel
                  label={`Photographs of ${property.title}`}
                  slides={gallery.map(
                    (g): CarouselSlide => ({
                      src: mediaUrl(g.media, 'large')!,
                      alt: g.media!.alt,
                      width: g.media!.sizes?.large?.width || g.media!.width || 1600,
                      height: g.media!.sizes?.large?.height || g.media!.height || 900,
                      caption: g.caption,
                    }),
                  )}
                />
              </div>
            ) : null}

            {video ? (
              <div>
                <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '1.4rem' }}>
                  Walkthrough film
                </h2>
                <div style={{ aspectRatio: '16 / 9' }}>
                  <iframe
                    src={video}
                    title={`Walkthrough film of ${property.title}`}
                    style={{ width: '100%', height: '100%', border: 0, borderRadius: 'var(--radius)' }}
                    allow="accelerometer; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            ) : videoFile?.url ? (
              <div>
                <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '1.4rem' }}>
                  Walkthrough film
                </h2>
                <video controls preload="metadata" style={{ width: '100%', borderRadius: 'var(--radius)' }} src={videoFile.url} />
              </div>
            ) : null}

            {property.floorPlans && property.floorPlans.length > 0 ? (
              <div>
                <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '1.4rem' }}>
                  Floor plans
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {property.floorPlans.map((fp) => {
                    const file = asMedia(fp.file)
                    if (!file) return null
                    const isPdf = file.mimeType === 'application/pdf'
                    return isPdf ? (
                      <a key={fp.id} href={file.url!} className="text-link" target="_blank" rel="noopener noreferrer">
                        {fp.label || 'Floor plan (PDF)'}
                      </a>
                    ) : (
                      <figure key={fp.id}>
                        <Image
                          src={mediaUrl(file, 'large')!}
                          alt={file.alt}
                          width={file.sizes?.large?.width || file.width || 1600}
                          height={file.sizes?.large?.height || file.height || 900}
                          sizes="(max-width: 768px) 100vw, 60vw"
                          loading="lazy"
                        />
                        {fp.label ? <figcaption style={{ marginTop: '0.6rem', fontSize: 'var(--text-small)', color: 'var(--text-faint)' }}>{fp.label}</figcaption> : null}
                      </figure>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="prop-aside" aria-label="Property summary and enquiry">
            <div className="spec-table">
              {(property.specifications || []).map((s) => (
                <div key={s.id} className="spec-row">
                  <span className="k">{s.label}</span>
                  <span className="v">{s.value}</span>
                </div>
              ))}
            </div>
            {property.amenities && property.amenities.length > 0 ? (
              <ul className="amenity-list">
                {property.amenities.map((a) => (
                  <li key={a.id}>{a.name}</li>
                ))}
              </ul>
            ) : null}
            <hr className="rule" />
            <div id="enquiry">
              <h2 className="display" style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>
                Enquire about this floor
              </h2>
              <EnquiryForm consentText={settings.consentText || ''} propertyId={property.id} />
            </div>
          </aside>
        </div>
      </section>

      <section className="section-tight on-dark deep">
        <div className="container cta-band">
          <h2 className="display inv" style={{ fontSize: 'var(--text-display-s)' }}>
            Not quite the one? The brief matters more than the listing.
          </h2>
          <Link href="/properties" className="btn btn-ghost">
            View all properties
          </Link>
        </div>
      </section>
    </>
  )
}
