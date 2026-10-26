/**
 * Finds the Vercel Blob read-write token, whatever it is called.
 *
 * Vercel names it BLOB_READ_WRITE_TOKEN by default, but a store connected under
 * a custom prefix arrives as <PREFIX>_READ_WRITE_TOKEN instead. Two separate
 * places need this answer and must agree: the storage adapter that uploads
 * files, and next/image's remotePatterns that allow those files to be
 * displayed. If they disagree, uploads succeed and then every image 500s with
 * "hostname is not configured".
 *
 * Kept free of imports so next.config.ts can use it as cheaply as the app does.
 */
export const vercelBlobToken = (env: NodeJS.ProcessEnv = process.env): string | undefined => {
  const direct = env.BLOB_READ_WRITE_TOKEN?.trim()
  if (direct) return direct

  const match = Object.entries(env).find(
    ([key, value]) => key.endsWith('_READ_WRITE_TOKEN') && /^vercel_blob_rw_/i.test(value?.trim() || ''),
  )
  return match?.[1]?.trim()
}
