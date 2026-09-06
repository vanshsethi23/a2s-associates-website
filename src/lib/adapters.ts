import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'

/**
 * Database and media storage are chosen from the environment, so the same
 * codebase runs on a laptop (SQLite + local files) and in production
 * (Postgres + object storage) with no code change.
 *
 * See README "Deployment" for which variables to set where.
 */

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'file:./a2s.db'
const isPostgres = /^postgres(ql)?:\/\//.test(dbUrl)

export const databaseAdapter = isPostgres
  ? postgresAdapter({
      pool: { connectionString: dbUrl },
      // Schema is applied by committed migrations in production; `push` would
      // try to diff the live database at boot, which serverless must not do.
      push: process.env.NODE_ENV !== 'production',
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
 * connected under a custom prefix arrives as <PREFIX>_READ_WRITE_TOKEN. Missing
 * it would silently fall through to local disk, so any variable holding a
 * recognisable Blob token counts. The adapter rejects malformed tokens, hence
 * matching on the value's shape rather than trusting the name alone.
 */
const blobToken = (): string | undefined => {
  const direct = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (direct) return direct

  const match = Object.entries(process.env).find(
    ([key, value]) => key.endsWith('_READ_WRITE_TOKEN') && /^vercel_blob_rw_/i.test(value?.trim() || ''),
  )
  return match?.[1]?.trim()
}

const vercelBlobToken = blobToken()

if (vercelBlobToken) {
  storagePlugins.push(
    vercelBlobStorage({
      collections: { media: true },
      token: vercelBlobToken,
    }),
  )
} else if (process.env.S3_BUCKET) {
  storagePlugins.push(
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET,
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
}

/** True when uploads land on the local disk, i.e. they are not deploy-safe. */
export const usingLocalDiskStorage = storagePlugins.length === 0

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
