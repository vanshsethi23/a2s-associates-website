import localFont from 'next/font/local'

/**
 * Brand typefaces, self-hosted from the supplied brand kit.
 * Fraunces (variable) for display, IBM Plex Sans (variable) for body,
 * IBM Plex Mono for wayfinding labels and figures.
 */
export const fraunces = localFont({
  src: [
    { path: '../../public/fonts/fraunces-latin.woff2', weight: '300 900', style: 'normal' },
    { path: '../../public/fonts/fraunces-italic-latin.woff2', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

export const plexSans = localFont({
  src: [{ path: '../../public/fonts/plex-sans-latin.woff2', weight: '300 700', style: 'normal' }],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

export const plexMono = localFont({
  src: [
    { path: '../../public/fonts/plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/plex-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
})
