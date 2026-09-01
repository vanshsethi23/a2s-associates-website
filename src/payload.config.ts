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
   * so the canonical URL is only pinned in production. Extra production
   * origins (e.g. a preview URL) can be added via PAYLOAD_CSRF_ORIGINS,
   * comma-separated.
   */
  serverURL: isProduction && publicURL ? publicURL : undefined,
  csrf: isProduction
    ? [publicURL, ...(process.env.PAYLOAD_CSRF_ORIGINS || '').split(',')]
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: databaseAdapter,
  sharp,
  plugins: [...storagePlugins],
})
