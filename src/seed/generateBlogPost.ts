/**
 * Generates one article immediately, without waiting for the schedule.
 *
 * Use it to check the Gemini keys and see the output quality before letting
 * the cron run unattended:  npm run blog:generate
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { generateAndPublishPost } from '@/lib/blogAutomation'
import { geminiConfigured } from '@/lib/gemini'

const run = async (): Promise<void> => {
  if (!geminiConfigured()) {
    console.error('GEMINI_API_KEY is not set in .env. Add it and try again.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  try {
    const result = await generateAndPublishPost(payload)
    console.log('')
    console.log(`  ${result.status === 'draft' ? 'Draft saved' : 'Published'}: ${result.title}`)
    console.log(`  Topic:  ${result.topic}`)
    console.log(`  URL:    /blog/${result.slug}`)
    const imageLine =
      result.image === 'generated'
        ? 'generated'
        : result.image === 'skipped'
          ? 'none yet. Add one in /admin, using the suggested image brief saved on the post.'
          : `generation FAILED: ${result.imageError}`
    console.log(`  Image:  ${imageLine}`)
    console.log('')
    process.exit(0)
  } catch (err) {
    console.error('\n  Generation failed:', err instanceof Error ? err.message : err, '\n')
    process.exit(1)
  }
}

void run()
