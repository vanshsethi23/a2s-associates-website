'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { telHref } from '@/lib/contact'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/properties', label: 'Properties' },
  { href: '/blog', label: 'News & Blogs' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ phones = [], email }: { phones?: string[]; email?: string | null }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // close the mobile menu when navigation changes the path (state-during-render pattern)
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    if (open) setOpen(false)
  }

  // The home page shows the transparent-over-film header until the visitor
  // scrolls; interior pages are always solid.
  const onHome = pathname === '/'
  const solid = !onHome || scrolled

  useEffect(() => {
    if (!onHome) return
    let ticking = false
    const update = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    const initial = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(initial)
      window.removeEventListener('scroll', onScroll)
    }
  }, [onHome])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const current = (href: string) =>
    (href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined

  return (
    <>
      <header className={`site-header${solid || open ? ' is-solid' : ''}`}>
        <div className="container">
          <Link href="/" className="header-logo" aria-label="A2S Estates home">
            <Image
              src="/brand/logo-horizontal-dark.png"
              alt="A2S Estates"
              width={900}
              height={202}
              style={{ height: 42, width: 'auto' }}
              priority
            />
          </Link>
          <nav className="header-nav" aria-label="Primary">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact#enquiry" className="header-cta">
            Enquire
          </Link>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`}>
        <nav aria-label="Primary mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href)} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-contact">
          {phones.map((number) => (
            <a key={number} href={telHref(number)}>
              {number}
            </a>
          ))}
          {email ? <a href={`mailto:${email}`}>{email}</a> : null}
        </div>
      </div>
    </>
  )
}
