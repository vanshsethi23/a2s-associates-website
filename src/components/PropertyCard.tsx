import Image from 'next/image'
import Link from 'next/link'

import { AVAILABILITY_LABELS, asMedia, mediaUrl } from '@/lib/data'
import type { Property } from '@/payload-types'

export function PropertyCard({ property, sizes }: { property: Property; sizes?: string }) {
  const hero = asMedia(property.heroImage)
  const img = mediaUrl(hero, 'card')
  const specs = [property.configuration, property.area, property.floor].filter(Boolean).join(' · ')
  const status = property.availability ? AVAILABILITY_LABELS[property.availability] : null

  return (
    <Link href={`/properties/${property.slug}`} className="prop-card">
      <span className="prop-card-media">
        {img ? (
          <Image
            src={img}
            alt={hero?.alt || property.title}
            width={hero?.sizes?.card?.width || 900}
            height={hero?.sizes?.card?.height || 600}
            sizes={sizes || '(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          />
        ) : null}
        {status && status !== 'Available' ? <span className="prop-card-status">{status}</span> : null}
      </span>
      <span className="prop-card-body">
        <span className="prop-card-locality">{property.locality}</span>
        <h3>{property.title}</h3>
        {specs ? <span className="prop-card-specs">{specs}</span> : null}
        <span className="prop-card-price">
          {property.price || 'On request'}
          {property.priceNote ? <small>{property.priceNote}</small> : null}
        </span>
      </span>
    </Link>
  )
}
