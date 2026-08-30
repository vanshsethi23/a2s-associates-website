'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * Scroll-scrubbed cinematic hero.
 *
 * The walkthrough film is delivered as a WebP frame sequence and drawn to a
 * canvas: scroll position maps (through a dwell-remap curve that breathes at
 * each room) to a frame index, smoothed with an exponential LERP so fast
 * scrolling stays buttery. Frames load progressively - a coarse tier first so
 * the scrub works within ~1s, then the full sequence.
 *
 * Reduced-motion and Save-Data visitors get the static poster instead.
 */

const FRAME_COUNT = 120
const DESKTOP_DIR = '/frames/desktop'
const MOBILE_DIR = '/frames/mobile'

type Chapter = {
  id: string
  rail: string
  from: number // rail active range (video progress)
  to: number
  caption?: { room: string; line: string; from: number; to: number }
  dwell?: number // dwell centre (video progress)
}

const CHAPTERS: Chapter[] = [
  { id: 'arrival', rail: 'Arrival', from: 0, to: 0.27, dwell: 0.055 },
  {
    id: 'living',
    rail: 'Living',
    from: 0.27,
    to: 0.4,
    dwell: 0.34,
    caption: { room: 'The Living Floor', line: 'Formal rooms that run front to back through the plan.', from: 0.28, to: 0.39 },
  },
  {
    id: 'kitchen',
    rail: 'Kitchen',
    from: 0.4,
    to: 0.49,
    dwell: 0.435,
    caption: { room: 'The Kitchen', line: 'A marble island at the centre of the residence.', from: 0.4, to: 0.458 },
  },
  {
    id: 'bedroom',
    rail: 'Bedroom',
    from: 0.49,
    to: 0.63,
    dwell: 0.555,
    caption: { room: 'The Bedroom', line: 'A suite that settles into quiet.', from: 0.5, to: 0.615 },
  },
  {
    id: 'bath',
    rail: 'Bath',
    from: 0.63,
    to: 0.76,
    dwell: 0.675,
    caption: { room: 'The Bath', line: 'Stone, glass and a view into the canopy.', from: 0.635, to: 0.72 },
  },
  {
    id: 'terrace',
    rail: 'Terrace',
    from: 0.76,
    to: 1.001,
    dwell: 0.92,
    caption: { room: 'The Terrace', line: 'A private garden above the treeline.', from: 0.84, to: 0.9 },
  },
]

/** Build the scroll->video progress remap that slows at each dwell centre. */
function buildRemap(): (p: number) => number {
  const N = 1200
  const WIDTH = 0.055
  const PEAK = 2.4
  const centers = CHAPTERS.map((c) => c.dwell).filter((d): d is number => d != null)
  const density = (x: number) => {
    let d = 1
    for (const c of centers) d += PEAK * Math.exp(-((x - c) ** 2) / (2 * WIDTH * WIDTH))
    return d
  }
  // forward integral: how much scroll each unit of video progress consumes
  const cum = new Float64Array(N + 1)
  for (let i = 1; i <= N; i++) cum[i] = cum[i - 1] + density((i - 0.5) / N)
  const total = cum[N]
  // invert: scroll progress -> video progress
  return (p: number) => {
    const target = Math.min(Math.max(p, 0), 1) * total
    let lo = 0
    let hi = N
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cum[mid] < target) lo = mid + 1
      else hi = mid
    }
    if (lo === 0) return 0
    const frac = (target - cum[lo - 1]) / (cum[lo] - cum[lo - 1])
    return (lo - 1 + frac) / N
  }
}

const frameSrc = (dir: string, i: number) => `${dir}/f-${String(i + 1).padStart(3, '0')}.webp`

const subscribeMotionPref = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

const wantsStaticHero = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return Boolean(reduced || conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g')
}

export function CinematicHero() {
  // false during SSR/hydration; resolves on the client without extra renders
  const isStatic = useSyncExternalStore(subscribeMotionPref, wantsStaticHero, () => false)
  if (isStatic) return <StaticHero />
  return <CinemaHero />
}

function HeroTitleBlock() {
  return (
    <div className="hero-title-inner">
      <span className="label">South Delhi · Sale · Purchase · Renting · Collaboration</span>
      <h1>
        Ambition to <em>Success.</em>
      </h1>
      <p>
        Builder floors, pre-owned floors and office spaces across South Delhi, carried from first
        visit to finished room by one accountable firm.
      </p>
    </div>
  )
}

function StaticHero() {
  return (
    <section className="hero-static" aria-label="A2S Estates">
      <Image src="/frames/poster.webp" alt="Classical stone facade of a South Delhi builder floor at dusk" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-title">
        <HeroTitleBlock />
      </div>
    </section>
  )
}

function CinemaHero() {
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const loadRef = useRef<HTMLDivElement>(null)
  const loadBarRef = useRef<HTMLSpanElement>(null)

  const [activeChapter, setActiveChapter] = useState(0)
  const [liveCaption, setLiveCaption] = useState<string | null>(null)
  const [ctaLive, setCtaLive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const track = trackRef.current
    if (!canvas || !track) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 820
    const dir = isMobile ? MOBILE_DIR : DESKTOP_DIR
    const frameW = isMobile ? 960 : 1600
    const frameH = isMobile ? 540 : 900

    const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null)
    let loadedCount = 0
    let disposed = false

    const remap = buildRemap()
    let current = 0
    let raf = 0
    let running = false
    let lastDrawn = -1
    let chapterIdx = -1
    let captionId: string | null = null
    let ctaOn = false

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      lastDrawn = -1
    }

    const drawFrame = (idx: number) => {
      // nearest loaded frame so scrubbing never blanks
      let img: HTMLImageElement | null = null
      for (let d = 0; d < FRAME_COUNT; d++) {
        const lo = idx - d
        const hi = idx + d
        if (lo >= 0 && frames[lo]) {
          img = frames[lo]
          break
        }
        if (hi < FRAME_COUNT && frames[hi]) {
          img = frames[hi]
          break
        }
      }
      if (!img) return
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / frameW, ch / frameH)
      const dw = frameW * scale
      const dh = frameH * scale
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    const loadFrame = (i: number, cb?: () => void) => {
      if (frames[i]) return
      const img = new window.Image()
      img.decoding = 'async'
      img.src = frameSrc(dir, i)
      img
        .decode()
        .then(() => {
          if (disposed) return
          frames[i] = img
          loadedCount++
          if (loadBarRef.current) loadBarRef.current.style.transform = `scaleX(${loadedCount / FRAME_COUNT})`
          if (loadedCount >= FRAME_COUNT && loadRef.current) loadRef.current.classList.add('is-done')
          cb?.()
        })
        .catch(() => {
          /* dropped frame: nearest-neighbour fill covers it */
        })
    }

    // Progressive tiers: coarse skeleton first, then halves, then everything.
    const tierA: number[] = []
    for (let i = 0; i < FRAME_COUNT; i += 8) tierA.push(i)
    tierA.push(FRAME_COUNT - 1)
    let started = 0
    const startTiers = () => {
      let remainingA = tierA.length
      tierA.forEach((i) =>
        loadFrame(i, () => {
          remainingA--
          if (remainingA <= 0 && !disposed) {
            for (let i2 = 0; i2 < FRAME_COUNT; i2 += 2) loadFrame(i2)
            for (let i2 = 1; i2 < FRAME_COUNT; i2 += 2) loadFrame(i2)
          }
          if (lastDrawn === -1) {
            lastDrawn = -2
            drawFrame(0)
          }
        }),
      )
    }

    const progressOf = () => {
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) return 0
      return Math.min(Math.max(-rect.top / total, 0), 1)
    }

    const tick = () => {
      if (!running) return
      const raw = progressOf()
      const video = remap(raw)
      const target = video * (FRAME_COUNT - 1)
      const delta = target - current
      current = Math.abs(delta) < 0.05 ? target : current + delta * 0.14
      const idx = Math.round(current)
      if (idx !== lastDrawn) {
        drawFrame(idx)
        lastDrawn = idx
      }

      const p = current / (FRAME_COUNT - 1)

      // opening title fade
      if (titleRef.current) {
        const o = Math.min(Math.max(1 - (p - 0.03) / 0.09, 0), 1)
        titleRef.current.style.opacity = String(o)
        titleRef.current.style.transform = `translateY(${(1 - o) * -22}px)`
        titleRef.current.style.visibility = o <= 0.01 ? 'hidden' : 'visible'
      }

      // rail chapter
      let ci = 0
      for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].from) ci = i
      if (ci !== chapterIdx) {
        chapterIdx = ci
        setActiveChapter(ci)
      }

      // captions
      let live: string | null = null
      for (const c of CHAPTERS) {
        if (c.caption && p >= c.caption.from && p <= c.caption.to) {
          live = c.id
          break
        }
      }
      if (live !== captionId) {
        captionId = live
        setLiveCaption(live)
      }

      // terminal CTA
      const cta = p > 0.92
      if (cta !== ctaOn) {
        ctaOn = cta
        setCtaLive(cta)
      }

      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!running) {
            running = true
            if (!started) {
              started = 1
              startTiers()
            }
            raf = requestAnimationFrame(tick)
          }
        } else {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '25% 0px' },
    )

    sizeCanvas()
    io.observe(track)
    const onResize = () => {
      sizeCanvas()
      lastDrawn = -1
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className="hero" aria-label="A walk through a South Delhi builder floor">
      <div className="hero-track" ref={trackRef}>
        <div className="hero-sticky">
          <Image
            src="/frames/poster.webp"
            alt="Classical stone facade of a South Delhi builder floor at dusk"
            fill
            priority
            sizes="100vw"
            className="hero-poster"
          />
          <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
          <div className="hero-scrim" aria-hidden="true" />

          <div className="hero-title" ref={titleRef}>
            <HeroTitleBlock />
          </div>

          {CHAPTERS.filter((c) => c.caption).map((c) => (
            <div key={c.id} className={`hero-caption${liveCaption === c.id ? ' is-live' : ''}`} aria-hidden={liveCaption !== c.id}>
              <div className="hero-caption-room">{c.caption!.room}</div>
              <p className="hero-caption-line">{c.caption!.line}</p>
            </div>
          ))}

          <div className={`hero-cta${ctaLive ? ' is-live' : ''}`}>
            <div className="hero-cta-inner">
              <p className="hero-cta-title">Residences built and represented to this standard.</p>
              <Link href="/properties" className="btn btn-primary">
                View the properties
              </Link>
            </div>
          </div>

          <nav className="hero-rail" aria-label="Walkthrough progress">
            <span className="hero-rail-counter" aria-live="polite">
              {String(activeChapter + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
            </span>
            {CHAPTERS.map((c, i) => (
              <span key={c.id} className={`hero-rail-item${i === activeChapter ? ' is-active' : ''}`}>
                <span>{c.rail}</span>
              </span>
            ))}
          </nav>

          <div className="hero-load" ref={loadRef} aria-hidden="true">
            <span ref={loadBarRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
