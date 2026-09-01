import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { databaseAdapter, storagePlugins } from './lib/adapters'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Properties } from './collections/Properties'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Enquiries } from './collections/Enquiries'
import { BlogTopics } from './collections/BlogTopics'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'
const publicURL = process.env.NEXT_PUBLIC_SERVER_URL || ''

/**
 * Every origin the admin panel is legitimately reached from.
 *
 * Vercel serves the same deployment on several hostnames: the custom domain,
 * the project's .vercel.app domain, and a unique URL per deployment. Payload
 * refuses cookie-authenticated writes from any origin not listed here, so
 * without the Vercel-supplied names, signing in at the .vercel.app URL works
 * but every save fails with "You are not allowed to perform this action".
 * These variables are injected by Vercel automatically; they are simply absent
 * elsewhere, which is harmless.
 */
const withScheme = (host?: string): string | undefined =>
  host ? (host.startsWith('http') ? host : `https://${host}`) : undefined

const csrfOrigins = [
  publicURL,
  withScheme(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  withScheme(process.env.VERCEL_BRANCH_URL),
  withScheme(process.env.VERCEL_URL),
  ...(process.env.PAYLOAD_CSRF_ORIGINS || '').split(','),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · A2S Estates',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/icon-32.png' }],
    },
    avatar: 'default',
  },
  collections: [Properties, Posts, Categories, BlogTopics, Media, Enquiries, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  /**
   * serverURL doubles as Payload's CSRF allow-list: with it set, cookie-based
   * writes are refused from any other origin. Locally the dev server hops
   * ports (3000 -> 3001 when busy), which locked the admin out of publishing,
   * so the canonical URL is only pinned in production. See csrfOrigins above
   * for the production hostnames, plus PAYLOAD_CSRF_ORIGINS for any extras.
   */
  serverURL: isProduction && publicURL ? publicURL : undefined,
  csrf: isProduction
    ? csrfOrigins
    : [],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: databaseAdapter,
  sharp,
  plugins: [...storagePlugins],
})
