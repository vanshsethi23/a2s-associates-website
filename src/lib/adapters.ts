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

if (process.env.BLOB_READ_WRITE_TOKEN) {
  storagePlugins.push(
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
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
