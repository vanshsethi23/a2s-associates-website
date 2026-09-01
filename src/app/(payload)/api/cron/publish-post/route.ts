import { getPayload } from 'payload'
import config from '@payload-config'

import { generateAndPublishPost } from '@/lib/blogAutomation'
import { geminiConfigured } from '@/lib/gemini'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Writes and publishes the scheduled article. Called by Vercel Cron or the
 * GitHub Actions workflow every Monday and Saturday.
 *
 * Authorisation: `Authorization: Bearer $CRON_SECRET`. Vercel Cron sends this
 * header automatically when CRON_SECRET is set on the project.
 */
const authorised = (req: Request): boolean => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get('authorization') || ''
  return header === `Bearer ${secret}`
}

const handle = async (req: Request): Promise<Response> => {
  if (!authorised(req)) {
    // 404 rather than 401: an unauthenticated caller should not learn the
    // endpoint exists.
    return new Response('Not found', { status: 404 })
  }

  if (!geminiConfigured()) {
    return Response.json({ ok: false, error: 'GEMINI_API_KEY is not set.' }, { status: 503 })
  }

  try {
    const payload = await getPayload({ config })
    const result = await generateAndPublishPost(payload)
    payload.logger.info(`Blog automation ${result.status}: "${result.title}" (/blog/${result.slug})`)
    if (result.imageError) {
      payload.logger.warn(`Blog automation image failed: ${result.imageError}`)
    }
    return Response.json({ ok: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[blog-automation] failed:', message)
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
