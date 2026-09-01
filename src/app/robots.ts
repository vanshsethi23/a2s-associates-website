import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * Answer and generative engines only cite sites their crawlers can read, and
 * several of them (Google-Extended, Applebot-Extended, OAI-SearchBot) are
 * separate tokens from the classic search crawlers. They are listed
 * explicitly so the firm's content stays eligible to be surfaced and cited.
 * Remove a token here to opt out of that engine.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'meta-externalagent',
  'Amazonbot',
  'DuckAssistBot',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/']
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
