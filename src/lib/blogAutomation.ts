import type { Payload } from 'payload'

import { formatSlug } from '@/lib/formatSlug'
import { generateImage, generateJson } from '@/lib/gemini'
import { toLexical, type Block } from '@/lib/lexical'

/**
 * Generates and publishes one article.
 *
 * Editorial guardrails live in the prompt below and matter more than anything
 * else here: this writes to a real firm's website, unattended. The model is
 * told never to invent figures, law, dates or claims about A2S, because a
 * confident wrong sentence about Delhi property law is worse than no article.
 */

/** Used when the CMS topic queue is empty, so the schedule never misses. */
const FALLBACK_TOPICS = [
  'What buyers should inspect on a second visit to a South Delhi builder floor',
  'How roof and terrace rights are usually divided in a four-floor rebuild',
  'Stilt parking allocation: what to get in writing before you sign',
  'Reading a sanction plan against the floor as it was actually built',
  'What mutation is, and why a sale is not finished without it',
  'Questions worth asking a builder about specification schedules',
  'How lift shaft placement changes a builder floor plan',
  'Comparing a pre-owned independent floor with a new rebuild',
  'What a turnkey interiors contract should actually contain',
  'Preparing a South Delhi floor for sale: the work that pays for itself',
  'How office floor requirements differ from residential in South Delhi',
  'Understanding possession timelines in an under-construction rebuild',
  'The difference between carpet, built-up and super area in practice',
  'Snagging a newly finished floor before you take handover',
  'What to check about power backup and water supply before buying',
]

const CATEGORY_CHOICES = ['Guides', 'Market Notes', 'Firm News'] as const

type GeneratedArticle = {
  title: string
  slug: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  category: string
  tags: string[]
  keyTakeaways: string[]
  content: Block[]
  faqs: { question: string; answer: string }[]
  imagePrompt: string
  imageAlt: string
}

const ARTICLE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    excerpt: { type: 'string' },
    metaTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    category: { type: 'string', enum: [...CATEGORY_CHOICES] },
    tags: { type: 'array', items: { type: 'string' } },
    keyTakeaways: { type: 'array', items: { type: 'string' } },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['h2', 'h3', 'p'] },
          text: { type: 'string' },
        },
        required: ['type', 'text'],
      },
    },
    faqs: {
      type: 'array',
      items: {
        type: 'object',
        properties: { question: { type: 'string' }, answer: { type: 'string' } },
        required: ['question', 'answer'],
      },
    },
    imagePrompt: { type: 'string' },
    imageAlt: { type: 'string' },
  },
  required: [
    'title',
    'slug',
    'excerpt',
    'metaTitle',
    'metaDescription',
    'category',
    'tags',
    'keyTakeaways',
    'content',
    'faqs',
    'imagePrompt',
    'imageAlt',
  ],
}

const buildPrompt = (topic: string, angle: string | null, recentTitles: string[]): string => `
You are writing for A2S Estates, a real estate firm in South Delhi, India. It handles
sale, purchase, renting and collaboration of builder floors, pre-owned independent
floors and office spaces, and also delivers turnkey interior design, construction and
lift planning in-house.

Write one article on this topic: "${topic}"
${angle ? `Specific instructions from the editor: ${angle}` : ''}

ABSOLUTE RULES. Breaking any of these makes the article unusable:
- Never invent statistics, percentages, prices, growth figures, dates, survey results
  or study findings. If you cannot state something without a number you do not have,
  write the sentence without the number.
- Never invent facts about A2S Estates: no awards, no client counts, no years in
  business, no team members, no testimonials, no office locations, no case studies.
  You may say what the firm does, which is described above.
- Never state specific legal provisions, section numbers, stamp duty rates, tax rates,
  registration charges or statutory deadlines. Refer to the type of document or the
  kind of check instead, and advise readers to confirm current requirements with a
  professional.
- Never promise outcomes, returns, appreciation or price movements.
- Do not name other companies, brokers or developers.
- Write in British English. Do not use the em dash character. Use ordinary hyphens,
  commas, colons or separate sentences instead.
- Do not write in the first person singular. Use "we" for the firm sparingly, or
  neutral third person.

STYLE:
- Calm, precise, useful to an educated buyer. No hype, no filler, no "in today's fast
  paced market" openings, no exclamation marks.
- 700 to 950 words across the content blocks.
- Open with a direct 2 to 3 sentence answer to the question implied by the title,
  before any background. This opening must stand alone as a complete answer.
- Then 4 to 6 h2 sections. Prefer h2 headings phrased as the question a reader would
  actually type or ask aloud. Keep paragraphs to 2 to 4 sentences.
- Be concrete about South Delhi practice: the plotted colonies, four-floor rebuilds,
  stilt parking, lifts, terrace rights, the paperwork sequence.
- Close with a short section on what a reader should do next. Do not write a hard sell.

WRITING TO BE QUOTED BY SEARCH AND AI ANSWER ENGINES:
- Assume any single paragraph may be lifted out and shown on its own. Never open a
  paragraph with "This", "That" or "It" referring back to the previous paragraph, and
  never write "as mentioned above" or "in this article".
- Name the subject explicitly in the first sentence of each section rather than relying
  on the heading for context. Write "Mutation transfers..." not "It transfers...".
- Where a term is introduced, define it in the same sentence in plain words.
- State facts flatly and verifiably. Prefer "A builder floor is one full floor of a
  low-rise plot" over "Builder floors are considered by many to be...".

${recentTitles.length > 0 ? `ALREADY PUBLISHED, so choose a clearly different angle and title:\n${recentTitles.map((t) => `- ${t}`).join('\n')}` : ''}

Return JSON only, matching this shape:
- title: under 70 characters, specific, no colon-heavy clickbait.
- slug: lowercase words separated by hyphens, derived from the title.
- excerpt: one or two sentences, under 200 characters, summarising the answer.
- metaTitle: under 60 characters.
- metaDescription: under 155 characters, written to earn a click from search results.
- category: exactly one of ${CATEGORY_CHOICES.join(', ')}.
- tags: 3 to 5 short topical tags, each 1 to 3 words.
- keyTakeaways: exactly 4 short points, one sentence each, under 140 characters. Each
  must be a complete, standalone statement of fact that answers part of the title's
  question and still makes sense read entirely on its own, out of context. These are
  displayed in a summary box and published as structured data, so they are the most
  likely part of the page to be quoted by an AI assistant. No fragments, no
  "Learn more about...", no marketing.
- content: array of blocks, each { type: "h2" | "h3" | "p", text: "..." }. No markdown
  syntax inside text, no asterisks, no "##". Plain sentences only.
- faqs: exactly 4 questions a reader would ask about this topic, each answered in 2 to
  4 self contained sentences that make sense quoted on their own, with no reference to
  "the article above". These are published as structured data for answer engines.
- imagePrompt: a prompt for an image generator describing an editorial architectural
  photograph illustrating this topic. Describe a South Delhi style low rise residential
  building or refined interior, natural light, calm neutral palette of warm stone,
  cream and muted brass. It must contain no people, no text, no lettering, no signage,
  no logos, no watermarks.
- imageAlt: a factual description of that image for screen readers, under 120
  characters, describing only what is visible.
`.trim()

const uniqueSlug = async (payload: Payload, desired: string): Promise<string> => {
  const base = formatSlug(desired) || `post-${Date.now()}`
  let candidate = base
  for (let i = 2; i < 40; i++) {
    const clash = await payload.find({
      collection: 'posts',
      where: { slug: { equals: candidate } },
      limit: 1,
      pagination: false,
      overrideAccess: true,
    })
    if (clash.totalDocs === 0) return candidate
    candidate = `${base}-${i}`
  }
  return `${base}-${Date.now()}`
}

const resolveCategory = async (payload: Payload, title: string): Promise<number | undefined> => {
  const wanted = CATEGORY_CHOICES.includes(title as (typeof CATEGORY_CHOICES)[number]) ? title : 'Guides'
  const found = await payload.find({
    collection: 'categories',
    where: { title: { equals: wanted } },
    limit: 1,
    overrideAccess: true,
  })
  if (found.docs[0]) return found.docs[0].id as number
  const created = await payload.create({
    collection: 'categories',
    data: { title: wanted, slug: formatSlug(wanted) },
    overrideAccess: true,
  })
  return created.id as number
}

export type PublishResult = {
  postId: number
  slug: string
  title: string
  topic: string
  status: 'published' | 'draft'
  /**
   * 'skipped' is the normal case: images are made by hand in the admin panel,
   * so a run with no image is a success, not a failure. Kept distinct from
   * 'failed' so a real API problem is never reported as routine.
   */
  image: 'generated' | 'skipped' | 'failed'
  imageError?: string
}

export const generateAndPublishPost = async (payload: Payload): Promise<PublishResult> => {
  // 1. Pick a topic: the editor's queue first, then the built-in pool.
  const queued = await payload.find({
    collection: 'blog-topics',
    where: { status: { equals: 'queued' } },
    sort: 'createdAt',
    limit: 1,
    overrideAccess: true,
  })
  const queuedTopic = queued.docs[0]

  const recent = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    limit: 15,
    overrideAccess: true,
    select: { title: true },
  })
  const recentTitles = recent.docs.map((d) => d.title).filter(Boolean)

  let topic: string
  let angle: string | null = null
  if (queuedTopic) {
    topic = queuedTopic.topic
    angle = queuedTopic.angle ?? null
  } else {
    const usedLower = recentTitles.map((t) => t.toLowerCase())
    const unused = FALLBACK_TOPICS.filter(
      (t) => !usedLower.some((title) => title.includes(t.toLowerCase().slice(0, 25))),
    )
    const pool = unused.length > 0 ? unused : FALLBACK_TOPICS
    topic = pool[Math.floor(Math.random() * pool.length)]
  }

  // 2. Write the article.
  const article = await generateJson<GeneratedArticle>(
    buildPrompt(topic, angle, recentTitles),
    ARTICLE_SCHEMA,
  )

  if (!article.title || !Array.isArray(article.content) || article.content.length === 0) {
    throw new Error('Gemini returned an article with no title or body.')
  }

  const slug = await uniqueSlug(payload, article.slug || article.title)
  const categoryId = await resolveCategory(payload, article.category)

  // 3. Illustrate it, only when asked to. Images are generated and uploaded by
  //    hand through the admin panel by default, so the writer just leaves a
  //    brief on the post. A failed image must never lose a finished article, so
  //    the failure is recorded and the piece publishes without one.
  const generateImages = process.env.BLOG_AUTOMATION_GENERATE_IMAGES === 'true'
  let featuredImageId: number | undefined
  let imageError: string | undefined
  if (generateImages) {
    try {
      const image = await generateImage(article.imagePrompt)
      const media = await payload.create({
        collection: 'media',
        data: { alt: article.imageAlt?.slice(0, 200) || article.title },
        file: {
          data: image.buffer,
          mimetype: image.mimeType,
          name: `${slug}.${image.extension}`,
          size: image.buffer.length,
        },
        overrideAccess: true,
      })
      featuredImageId = media.id as number
    } catch (err) {
      imageError = err instanceof Error ? err.message : String(err)
    }
  }

  // 4. Publish (or hold as a draft when review mode is on).
  const reviewMode = process.env.BLOG_AUTOMATION_REVIEW_MODE === 'true'
  const post = await payload.create({
    collection: 'posts',
    overrideAccess: true,
    data: {
      title: article.title,
      slug,
      excerpt: article.excerpt,
      author: 'A2S Estates',
      publishedDate: new Date().toISOString(),
      category: categoryId,
      featuredImage: featuredImageId,
      imageBrief: article.imagePrompt,
      keyTakeaways: (article.keyTakeaways || [])
        .slice(0, 4)
        .map((point) => ({ point: point.slice(0, 200) })),
      content: toLexical(article.content),
      faqs: (article.faqs || []).slice(0, 6).map((f) => ({ question: f.question, answer: f.answer })),
      tags: (article.tags || []).slice(0, 5).map((tag) => ({ tag })),
      seo: {
        metaTitle: article.metaTitle?.slice(0, 70),
        metaDescription: article.metaDescription?.slice(0, 180),
      },
      _status: reviewMode ? 'draft' : 'published',
    } as never,
  })

  if (queuedTopic) {
    await payload.update({
      collection: 'blog-topics',
      id: queuedTopic.id,
      overrideAccess: true,
      data: { status: 'published', usedAt: new Date().toISOString(), post: post.id as number },
    })
  }

  return {
    postId: post.id as number,
    slug,
    title: article.title,
    topic,
    status: reviewMode ? 'draft' : 'published',
    image: featuredImageId ? 'generated' : generateImages ? 'failed' : 'skipped',
    imageError,
  }
}
