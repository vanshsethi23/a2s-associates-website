import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'

import { vercelBlobToken } from './blobToken'

/**
 * Database and media storage are chosen from the environment, so the same
 * codebase runs on a laptop (SQLite + local files) and in production
 * (Postgres + object storage) with no code change.
 *
 * See README "Deployment" for which variables to set where.
 */

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'file:./a2s.db'
const isPostgres = /^postgres(ql)?:\/\//.test(dbUrl)

/**
 * Whether this Postgres URL points at a database on this machine.
 *
 * `push` must never run against a hosted database. NODE_ENV alone is not a
 * safe signal: it is unset when a maintenance script like `seed:remote` runs
 * from a laptop with DATABASE_URL pointed at Neon, so push would silently
 * diff and rewrite the live schema and leave Payload's "ran in dev mode"
 * marker behind — which then makes every later `payload migrate` stop and ask
 * an interactive question no deploy can answer. Keying on the host instead
 * means the local dev convenience stays, and remote databases only ever change
 * through a committed migration.
 */
const isLocalPostgres = (url: string): boolean => {
  try {
    const { hostname } = new URL(url)
    return ['localhost', '127.0.0.1', '::1', '[::1]', ''].includes(hostname)
  } catch {
    return false
  }
}

export const databaseAdapter = isPostgres
  ? postgresAdapter({
      pool: { connectionString: dbUrl },
      // Schema is applied by committed migrations in production; `push` would
      // try to diff the live database at boot, which serverless must not do.
      push: process.env.NODE_ENV !== 'production' && isLocalPostgres(dbUrl),
    })
  : sqliteAdapter({ client: { url: dbUrl } })

/**
 * Uploads must go to object storage on any host with an ephemeral or
 * read-only filesystem (Vercel, Cloud Run, containers). Without one of these,
 * files are written to ./media and disappear on the next deploy.
 */
export const storagePlugins: Plugin[] = []

/**
 * Vercel names the Blob token BLOB_READ_WRITE_TOKEN by default, but a store
 * connected under a custom prefix arrives as <PREFIX>_READ_WRITE_TOKEN. The
 * lookup lives in blobToken.ts because next.config.ts has to reach the same
 * answer for next/image's remotePatterns.
 */
const vercelBlobTokenValue = vercelBlobToken()
const useVercelBlob = Boolean(vercelBlobTokenValue)
const useS3 = !useVercelBlob && Boolean(process.env.S3_BUCKET)

/**
 * Both plugins are ALWAYS registered, with at most one enabled.
 *
 * Each registers an admin client component (its upload handler) before it
 * checks whether it is enabled, so merely including a plugin changes the set of
 * components the admin panel expects to find in `admin/importMap.js`. Adding a
 * plugin only when its environment variable is present therefore makes that
 * generated file environment-dependent: `payload generate:importmap` runs on a
 * laptop with no storage configured and omits the entry, then production loads
 * the plugin, asks for a component the map does not contain, and every admin
 * page renders blank with only a server log to show for it.
 *
 * Registering both unconditionally keeps the config shape — and so the
 * importMap — identical everywhere. A disabled plugin installs no adapter, so
 * uploads still fall through to local disk exactly as before.
 */
storagePlugins.push(
  vercelBlobStorage({
    enabled: useVercelBlob,
    collections: { media: true },
    token: vercelBlobTokenValue || '',
  }),
  s3Storage({
    enabled: useS3,
    collections: { media: true },
    bucket: process.env.S3_BUCKET || '',
    config: {
      endpoint: process.env.S3_ENDPOINT || undefined,
      region: process.env.S3_REGION || 'auto',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      // Required by R2, MinIO and most non-AWS S3 implementations.
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    },
  }),
)

/** True when uploads land on the local disk, i.e. they are not deploy-safe. */
export const usingLocalDiskStorage = !useVercelBlob && !useS3

/**
 * On Vercel the local disk is discarded after every deploy, so this state loses
 * every uploaded image without any error at the point of upload. It is only
 * noticed later, as broken images on the live site, so say so loudly here.
 */
if (usingLocalDiskStorage && process.env.VERCEL) {
  console.warn(
    '[storage] No object storage configured: uploads will be written to disk and lost on the next deploy. ' +
      'Connect a Vercel Blob store (sets BLOB_READ_WRITE_TOKEN) or set S3_BUCKET. See README "Deployment".',
  )
}
