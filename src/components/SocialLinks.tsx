import type { SiteSetting } from '@/payload-types'

/**
 * The firm's social profiles, rendered from Site Settings.
 *
 * Until now socialLinks only fed the `sameAs` list in the Organization
 * structured data, so a profile added in the admin was invisible to readers.
 * This renders the same array, so adding or removing a link in one place
 * updates both the markup and the page.
 *
 * Marks are drawn rather than imported: one small monochrome set that inherits
 * currentColor keeps the footer restrained and avoids pulling in an icon
 * dependency for five glyphs. They are decorative, so each is aria-hidden and
 * the accessible name lives on the link.
 */
const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4 15.4 12l-5.2 2.6z" fill="currentColor" stroke="none" />
    </>
  ),
  X: <path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" />,
  Facebook: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.2 8.2h-1.3c-.9 0-1.4.5-1.4 1.4v1.6m-1.4 0h4.1m-2.7 0v4.6" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.6 10.4v6M7.6 7.6v.1M11.4 16.4v-6m0 1.9c0-1 .8-1.9 1.9-1.9s2 .9 2 1.9v4.1" />
    </>
  ),
}

export function SocialLinks({ settings }: { settings: SiteSetting }) {
  const links = (settings.socialLinks || []).filter((l) => l.platform && l.url?.trim())
  if (links.length === 0) return null

  return (
    <ul className="footer-social">
      {links.map((link) => {
        const platform = link.platform as string
        const icon = ICONS[platform]
        return (
          <li key={link.id || link.url}>
            <a
              href={link.url.trim()}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`A2S Estates on ${platform} (opens in a new tab)`}
            >
              {icon ? (
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  {icon}
                </svg>
              ) : (
                // A platform added to the select without a mark here still
                // shows up, named, rather than rendering an empty link.
                <span>{platform}</span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
