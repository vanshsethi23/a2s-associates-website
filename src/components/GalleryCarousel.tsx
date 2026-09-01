'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type CarouselSlide = {
  src: string
  alt: string
  width: number
  height: number
  caption?: string | null
}

const AUTOPLAY_MS = 3000

/**
 * Property photo carousel: crossfading slides that advance every 3s, with
 * manual prev/next controls and keyboard arrows. Autoplay pauses while the
 * visitor hovers or focuses the carousel, while the tab is hidden, and is
 * disabled entirely under prefers-reduced-motion.
 */
export function GalleryCarousel({ slides, label }: { slides: CarouselSlide[]; label: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedRef = useRef(false)

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (slides.length < 2 || paused || reducedRef.current) return
    const timer = setInterval(() => {
      if (!document.hidden) go(1)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [slides.length, paused, go, index]) // `index` resets the interval after manual navigation

  if (slides.length === 0) return null

  if (slides.length === 1) {
    const s = slides[0]
    return (
      <figure>
        <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 768px) 100vw, 60vw" loading="lazy" style={{ borderRadius: 'var(--radius)' }} />
        {s.caption ? <figcaption className="carousel-caption">{s.caption}</figcaption> : null}
      </figure>
    )
  }

  const active = slides[index]

  return (
    <section
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          go(-1)
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          go(1)
        }
      }}
    >
      <div className="carousel-frame">
        {slides.map((s, i) => (
          <div key={s.src} className={`carousel-slide${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
            <Image
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(max-width: 768px) 100vw, 60vw"
              loading={i === 0 ? undefined : 'lazy'}
            />
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <div className="carousel-nav">
          <button type="button" className="carousel-btn" onClick={() => go(-1)} aria-label="Previous photograph">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <button type="button" className="carousel-btn" onClick={() => go(1)} aria-label="Next photograph">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
        <p className="carousel-caption" aria-live="polite">
          {active.caption || active.alt}
        </p>
        <span className="carousel-count" aria-hidden="true">
          {index + 1} / {slides.length}
        </span>
      </div>
    </section>
  )
}
