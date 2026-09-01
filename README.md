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
- **SEO / AEO / GEO** — one entity graph (Organization, WebSite, WebPage,
  BreadcrumbList) plus per-page RealEstateListing with offers, Article with
  speakable ranges, and FAQPage on Services and every generated article.
  `sitemap.xml`, `robots.txt` that explicitly admits AI crawlers, and an
  `/llms.txt` summary generated from live content.
- **Automated blog** — Gemini writes one article every Monday and Saturday from
  a topic queue the team controls in the CMS, each with key takeaways, FAQs and
  internal links built for answer engines. Images are added by hand in `/admin`.
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
| `DATABASE_URL` | A `file:` URL uses SQLite (local). A `postgres://` URL switches the app to Postgres automatically — no code change. |
| `PAYLOAD_SECRET` | Long random string; signs login sessions. `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | Canonical site origin, e.g. `https://a2sestates.in`. Used in metadata, sitemap, JSON-LD. |
| `PAYLOAD_ADMIN_EMAIL/PASSWORD` | First admin user created by the seed. |
| `BLOB_READ_WRITE_TOKEN` *or* `S3_*` | Production media storage. Leave unset locally. |

Database and storage are selected from these variables in `src/lib/adapters.ts`,
so the same code runs on a laptop and in production.

## Content management

Everything the A2S team needs day-to-day lives at `/admin`:

- **Properties** — name, locality, type, offered-for, status, configuration, area,
  floor, facing, price, description, highlights, amenities, specification table,
  cover photograph, drag-to-reorder gallery, floor plans (image or PDF), video link
  or upload, SEO tab, and a "feature on the home page" toggle. Save Draft keeps a
  listing off the site; Publish makes it live. Pages revalidate automatically.
- **Blog posts** — title, category, featured image, suggested image brief,
  excerpt, key takeaways, rich-text content, FAQs, author, tags, publish date,
  SEO tab.
- **Enquiries** — every contact-form submission lands here with a status
  (New / Contacted / Closed) and private notes.
- **Site Settings** — address, phone, email, WhatsApp, office hours, map embed,
  consent text, copyright name, social links.

## Deployment

This is a server-rendered application, not a static site. It needs a Node
runtime for the admin panel, the database, image optimisation and the contact
form. **GitHub Pages, Netlify Drop and other static-only hosts cannot run it.**

### Option A — Vercel (recommended)

The Postgres schema migration is already committed, so the build creates the
tables on first deploy. This path has been rehearsed end to end against a real
Postgres instance: migrate, seed, production build, all pages, admin login,
admin writes and the contact form.

1. **Database.** Create a free Postgres database at [Neon](https://neon.tech)
   (or Vercel Postgres) and copy the connection string.

2. **Import the repo** at [vercel.com/new](https://vercel.com/new) and pick this
   branch. Next.js is detected automatically.

3. **Set the Build Command** to `npm run build:deploy` (Settings → Build &
   Development Settings). That runs the database migration before building; the
   plain `npm run build` does not.

4. **Environment variables** (Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | The Neon `postgres://…` string |
   | `PAYLOAD_SECRET` | Output of `openssl rand -hex 32` |
   | `NEXT_PUBLIC_SERVER_URL` | `https://your-domain.com` once you have it, otherwise your `.vercel.app` URL |
   | `GEMINI_API_KEY` | Only if you want the automated blog |
   | `CRON_SECRET` | Only if you want the automated blog |

   You do not need to list the `.vercel.app` hostnames for the admin panel:
   Vercel's own URLs are trusted automatically (see `csrfOrigins` in
   `src/payload.config.ts`). Add `PAYLOAD_CSRF_ORIGINS` only for a hostname
   outside both, comma-separated.

5. **Media storage.** Storage → create a **Blob** store → connect it to the
   project. That sets `BLOB_READ_WRITE_TOKEN` for you, and uploads then survive
   redeploys. Without it, uploaded images vanish on the next deploy.

6. **Deploy.** The build runs the migration and creates the tables.

7. **Create the first admin user and starter content.** Once, from your own
   machine with `DATABASE_URL` temporarily pointed at Neon:

   ```bash
   npm run seed
   ```

   Then put your local `.env` back to `file:./a2s.db`. Log in at
   `/admin`, change the password immediately, and check Site Settings shows the
   right contact details.

8. **Domain.** Settings → Domains, add the domain and point DNS at the records
   shown. Then set `NEXT_PUBLIC_SERVER_URL` to that domain and redeploy, so
   canonical URLs, the sitemap and structured data use it.

**After a schema change.** Editing collections means a new migration:

```bash
# with DATABASE_URL pointing at Neon
npm run migrate:create
git add src/migrations && git commit -m "Add migration for <change>"
```

The next deploy applies it. Local SQLite development needs none of this; it
syncs its schema automatically.

### Option B — A VPS (Hetzner, DigitalOcean, Linode)

Simpler in concept and cheaper at scale, but you maintain the server. Because a
VPS has a real, persistent disk, **SQLite and the local `media/` folder work
as-is** — no Postgres, no object storage, nothing extra to configure.

```bash
git clone <repo> && cd a2s-associates-website
npm ci && cp .env.example .env   # edit .env
npm run seed && npm run build
npx pm2 start "npm run start" --name a2s   # keeps it running and restarts on reboot
```

Put Nginx or Caddy in front for HTTPS, and back up `a2s.db` and `media/` on a
schedule — those two files are the entire site's content.

### What will not work

| Host | Why |
| --- | --- |
| GitHub Pages | Static files only. No Node server, so no `/admin`, no database, no contact form, no image optimisation. |
| Plain S3 / Cloudflare Pages (static mode) | Same reason. |
| Any host without persistent storage, using SQLite | The database file resets on every deploy. Use Postgres there. |

## Content status

**Live and approved:**

- Office address, phone numbers, email and hours (Site Settings).
- Privacy Policy and Terms & Conditions, approved by A2S Estates and indexable.

**Still sample content — replace via `/admin` before launch:**

- **All six property listings.** Sample data; the photographs are stills from
  the walkthrough film, not the actual properties.
- **Blog posts.** Three evergreen guides, accurate but generic. Review before
  promoting them.
- **Consent text.** The brief originally supplied wording naming "Rana Infra",
  which is not the A2S Estates brand; it was rewritten for A2S Estates and is
  editable at Site Settings → Legal & consent.

Contact details live in the CMS. `src/seed/contact.ts` holds the official
values so a fresh database starts correct, and `npm run seed:contact` restores
them to an existing database without touching properties, posts or enquiries.

## SEO, AEO and GEO

Three overlapping audiences, handled deliberately:

- **SEO (search engines).** Per-page titles, descriptions and canonicals,
  Open Graph and Twitter cards, a sitemap covering every property and article,
  and structured data for listings including a real `Offer` with price in INR
  where the price field contains a parseable figure.
- **AEO (answer engines: AI Overviews, voice, featured snippets).** `FAQPage`
  markup on the Services page and on every article, an answer-first opening
  paragraph enforced in the writer's brief, and `speakable` ranges on articles.
  The FAQ text in the schema is always the same text a visitor sees on the
  page; publishing schema-only answers is what earns manual actions.
- **GEO (generative engines: ChatGPT, Perplexity, Claude, Gemini).**
  `/llms.txt` gives models a clean factual brief on the firm, its services,
  its live listings and its articles, generated from the CMS so it cannot go
  stale. `robots.txt` names the AI crawlers explicitly and admits them; remove
  a token from `AI_CRAWLERS` in `src/app/robots.ts` to opt out of one. Stable
  `@id` values let engines resolve every page to a single business entity.

To check the markup after any content change, paste a URL into Google's Rich
Results Test and Schema.org's validator.

## Automated blog

Gemini writes and illustrates one article every **Monday and Saturday at 09:00
IST**, then publishes it.

### Setup

1. Get a key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Set on the host (and in `.env` to test locally):

   | Variable | Purpose |
   | --- | --- |
   | `GEMINI_API_KEY` | Required. Without it, automation stays off. |
   | `CRON_SECRET` | Required. `openssl rand -hex 32`. Protects the endpoint. |
   | `GEMINI_TEXT_MODEL` | Optional override, default `gemini-2.5-flash`. |
   | `GEMINI_IMAGE_MODEL` | Optional override, default `gemini-2.5-flash-image`. |
   | `BLOG_AUTOMATION_REVIEW_MODE` | `true` saves drafts instead of publishing. |
   | `BLOG_AUTOMATION_GENERATE_IMAGES` | `true` lets Gemini make the images. Off by default. |

   Model IDs are configurable because Google renames and retires them. If a run
   fails with a 404 from Gemini, set the current ID rather than editing code.

3. Test it before trusting the schedule:

   ```bash
   npm run blog:generate
   ```

   This writes one real article immediately and prints where it landed, e.g.

   ```
   Published: Verifying Lift Service Contracts When Buying Top Floors
   Topic:  How to verify a lift service contract before buying a top floor
   URL:    /blog/verifying-lift-service-contracts-when-buying-top-floors
   Image:  none yet. Add one in /admin, using the suggested image brief saved on the post.
   ```

   Read it at that URL with `npm run dev` running, and open the same post in
   `/admin` to see the takeaways, FAQs, SEO fields and image brief it produced.

   To test exactly what the scheduler will do, call the endpoint the same way
   Vercel Cron does, with the dev server running:

   ```bash
   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
     http://localhost:3000/api/cron/publish-post
   ```

4. Enable **one** scheduler, not both:
   - **Vercel**: `vercel.json` already declares the cron. Set `CRON_SECRET` in
     the project and Vercel sends it automatically.
   - **Anywhere else**: enable `.github/workflows/publish-blog-post.yml` and add
     `SITE_URL` and `CRON_SECRET` as repository secrets.

### Featured images

Images are added by hand, so no image API quota or billing is needed. Each
generated article arrives with a **suggested image brief** written for it: open
the post in `/admin`, copy that brief into whichever image tool you use, and
upload the result into Featured Image. Articles publish without waiting for
this and show a branded placeholder on listing cards until an image is added,
so nothing looks broken in the meantime. The Posts list shows the image column,
so it is easy to see which articles still need one.

Adding an image also makes the article eligible for image-rich search results,
so it is worth doing within a day or two of publication.

To hand this back to Gemini later, set `BLOG_AUTOMATION_GENERATE_IMAGES=true`
and enable billing on the Cloud project behind the API key.

### Steering what gets written

The **Blog topics** collection in the admin is the queue. Add a topic, and
optionally an angle telling the writer what to cover or avoid; the next
scheduled run takes the oldest queued topic and marks it published. If the
queue is empty the writer falls back to its own pool of South Delhi property
topics, so the schedule never misses.

### Editorial guardrails

Every generated article is built for search, answer and generative engines:
four standalone **key takeaways** in a summary box (the passage most likely to
be quoted by an AI assistant, also published as the article's `abstract`), four
self-contained **FAQ** answers as `FAQPage` markup, `Article` markup with word
count and topic entities, and automatic internal links to the relevant service
pages and related articles. The writer is instructed to keep every paragraph
quotable on its own, with no "as mentioned above" references that break when a
single passage is lifted out.

The writer's brief (in `src/lib/blogAutomation.ts`) forbids invented
statistics, prices, dates and study findings; invented facts about A2S such as
awards, client numbers or testimonials; specific legal provisions, stamp duty
or tax rates; and any promise about returns or price movement. Each article
must open with a standalone answer and end with four self-contained FAQ
answers, which is what answer engines quote.

**These guardrails reduce risk; they do not remove it.** The articles publish
unreviewed. Set `BLOG_AUTOMATION_REVIEW_MODE=true` to hold them as drafts if
you would rather approve each one, and read the first few runs either way.

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
| `npm run seed:contact` | Restore the official contact details in Site Settings |
| `npm run blog:generate` | Write and publish one article now (tests the Gemini setup) |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `npm run migrate:create` | Generate a Postgres migration (production only) |
| `npm run build:deploy` | Run migrations, then build. Use as the host's build command. |
| `npm run lint` | ESLint |
