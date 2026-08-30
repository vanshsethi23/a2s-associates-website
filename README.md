# A2S Estates — Website & CMS

A cinematic, CMS-driven website for **A2S Estates**, a South Delhi real-estate firm.
Built with Next.js (App Router) and Payload CMS in a single application: the public
site and the admin panel deploy together.

## Highlights

- **Cinematic scroll hero** — the property walkthrough film plays as a scroll-scrubbed
  WebP frame sequence on a canvas (120 frames, desktop + mobile sets), with a
  dwell-remap curve that slows at each room, room typography (Living / Kitchen /
  Bedroom / Bath / Terrace), a side progress rail, progressive frame loading, and a
  static-poster fallback for reduced-motion / Save-Data visitors.
- **Payload CMS** at `/admin` — Properties, Blog posts, Categories, Media, Enquiries
  and Site Settings are all editable without touching code. Drafts, autosave,
  publish, drag-to-reorder galleries, per-document SEO fields.
- **SEO** — dynamic metadata, `sitemap.xml`, `robots.txt`, JSON-LD
  (RealEstateAgent / RealEstateListing / Article), clean URLs.
- **Design system** — brand palette (Ink Charcoal, Warm Stone, Brass, Slate, Bone)
  and self-hosted brand type (Fraunces, IBM Plex Sans/Mono) extracted from the
  supplied brand kit.

## Quick start

```bash
npm install
npm run seed     # creates the admin user + sample content (safe: skips if users exist)
npm run dev      # http://localhost:3000  ·  admin at /admin
```

Default local admin login (change immediately):

- Email: `admin@a2sestates.local`
- Password: `a2s-change-me`

Set `PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD` in `.env` before seeding to
use different credentials.

## Environment

Copy `.env.example` to `.env`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite by default (`file:./a2s.db`). Point at Postgres via `@payloadcms/db-postgres` for production (see below). |
| `PAYLOAD_SECRET` | Long random string; signs auth tokens. |
| `NEXT_PUBLIC_SERVER_URL` | Canonical site origin, e.g. `https://a2sestates.in`. Used in metadata, sitemap, JSON-LD. |
| `PAYLOAD_ADMIN_EMAIL/PASSWORD` | First admin user created by the seed. |

## Content management

Everything the A2S team needs day-to-day lives at `/admin`:

- **Properties** — name, locality, type, offered-for, status, configuration, area,
  floor, facing, price, description, highlights, amenities, specification table,
  cover photograph, drag-to-reorder gallery, floor plans (image or PDF), video link
  or upload, SEO tab, and a "feature on the home page" toggle. Save Draft keeps a
  listing off the site; Publish makes it live. Pages revalidate automatically.
- **Blog posts** — title, category, featured image, excerpt, rich-text content,
  author, tags, publish date, SEO tab.
- **Enquiries** — every contact-form submission lands here with a status
  (New / Contacted / Closed) and private notes.
- **Site Settings** — address, phone, email, WhatsApp, office hours, map embed,
  consent text, copyright name, social links.

## Production deployment

The app runs anywhere Node 20+ runs (`npm run build && npm run start`).
Recommended: Vercel or a small VPS.

For a serverless/multi-instance host, switch the two local pieces:

1. **Database** — install `@payloadcms/db-postgres` and swap the adapter in
   `src/payload.config.ts`; point `DATABASE_URL` at Postgres (Neon/Supabase/RDS).
2. **Media storage** — install `@payloadcms/storage-s3` (or `storage-vercel-blob`)
   and register it in the config's `plugins`, so uploads survive redeploys.

On a single VPS, SQLite + the local `media/` directory work as-is; back both up.

## Placeholder content — replace before launch

All of the following was seeded as clearly-labelled sample content and must be
replaced with real information via `/admin`:

- **All six property listings** (sample data; images are stills from the
  walkthrough film).
- **Site Settings → Contact**: address, phone `+91 00000 00000`, email.
- **Consent text**: the brief's original checkbox text referenced **"Rana Infra"**,
  which does not match the A2S Estates brand; it has been rewritten for
  A2S Estates and needs sign-off (Site Settings → Legal & consent).
- **Privacy Policy and Terms & Conditions** pages are working drafts for counsel review.
- Blog posts are generic evergreen guides; review before publishing more widely.

## Hero film pipeline

The scroll hero consumes `public/frames/desktop` (1600×900) and
`public/frames/mobile` (960×540), 120 WebP frames each, named `f-001.webp` …
`f-120.webp`, plus `public/frames/poster.webp`. To swap the film, re-extract with
ffmpeg (every 2nd frame of a 24fps, 10s film):

```bash
ffmpeg -i film.mp4 -vf "select='not(mod(n\,2))',scale=1600:900" -vsync vfr \
  -c:v libwebp -quality 70 public/frames/desktop/f-%03d.webp
```

Chapter timings live in `src/components/CinematicHero.tsx` (`CHAPTERS`), expressed
as fractions of the film; retune them to the new footage.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run seed` | First admin user + sample content |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `npm run lint` | ESLint |
