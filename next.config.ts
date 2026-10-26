import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

import { vercelBlobToken } from './src/lib/blobToken'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * In production, uploads are served from object storage rather than by the
 * app, so those hosts have to be allow-listed for next/image. Files the app
 * serves itself stay same-origin (see toSameOriginPath in src/lib/data.ts).
 *
 * The Blob check must use the same lookup as src/lib/adapters.ts: a store
 * connected under a custom prefix sets <PREFIX>_READ_WRITE_TOKEN, and if only
 * one of the two spots recognises it, uploads succeed while every image fails
 * to render.
 */
const remotePatterns: NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> = []

if (vercelBlobToken()) {
  remotePatterns.push({ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' })
}

if (process.env.S3_BUCKET) {
  const s3Host = process.env.S3_ENDPOINT
    ? new URL(process.env.S3_ENDPOINT).hostname
    : `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com`
  remotePatterns.push({ protocol: 'https', hostname: s3Host })
}

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/brand/**' },
      { pathname: '/frames/**' },
      { pathname: '/stills/**' },
    ],
    remotePatterns,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
