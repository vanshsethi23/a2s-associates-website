import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichTextContent } from '@/components/RichTextContent'
import { asMedia, getPostBySlug, mediaUrl } from '@/lib/data'
import {
  ORG_ID,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  jsonLdScript,
} from '@/lib/seo'

export const revalidate = 3600

type Params = { params: Promise<{ slug: string }> }

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const og = mediaUrl(asMedia(post.seo?.ogImage) || asMedia(post.featuredImage), 'og')
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: og ? { type: 'article', images: [{ url: og }] } : { type: 'article' },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const img = asMedia(post.featuredImage)
  const imgUrl = mediaUrl(img, 'large')
  const category = post.category && typeof post.category === 'object' ? post.category.title : null

  const faqs = (post.faqs || []).map((f) => ({ question: f.question, answer: f.answer }))

  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'News & Blogs', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    {
      '@type': 'Article',
      '@id': `${SITE_URL}/blog/${post.slug}#article`,
      headline: post.title,
      description: post.excerpt || undefined,
      image: imgUrl ? [absoluteUrl(imgUrl)] : undefined,
      datePublished: post.publishedDate || post.createdAt,
      dateModified: post.updatedAt,
      author: { '@type': 'Organization', name: post.author || 'A2S Estates', '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': WEBSITE_ID },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
      articleSection: category || undefined,
      keywords: (post.tags || []).map((t) => t.tag).filter(Boolean).join(', ') || undefined,
      inLanguage: 'en-IN',
      // Tells voice and answer engines which parts are safe to read aloud.
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.article-head h1', '.article-head p'],
      },
    },
    faqJsonLd(faqs),
  )

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <section className="page-hero" style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="container article-head" style={{ marginInline: 'auto' }}>
          <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono-stack)', fontSize: 'var(--text-label)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {category ? <span style={{ color: 'var(--brass)' }}>{category}</span> : null}
            {post.publishedDate ? (
              <time dateTime={post.publishedDate} style={{ color: 'var(--text-inv-faint)' }}>
                {dateFmt.format(new Date(post.publishedDate))}
              </time>
            ) : null}
          </div>
          <h1 style={{ color: 'var(--bone)' }}>{post.title}</h1>
          {post.excerpt ? <p style={{ color: 'var(--text-inv-body)', fontSize: 'var(--text-body-l)' }}>{post.excerpt}</p> : null}
          {post.author ? (
            <p style={{ fontFamily: 'var(--font-mono-stack)', fontSize: 'var(--text-small)', color: 'var(--text-inv-faint)' }}>By {post.author}</p>
          ) : null}
        </div>
      </section>

      <section className="section bg-bone" style={{ paddingTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <div className="container">
          {imgUrl ? (
            <div className="article-media" style={{ marginTop: 0, marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
              <Image
                src={imgUrl}
                alt={img?.alt || post.title}
                width={img?.sizes?.large?.width || 1600}
                height={img?.sizes?.large?.height || 900}
                sizes="(max-width: 1024px) 100vw, 980px"
                priority
              />
            </div>
          ) : null}

          <RichTextContent data={post.content} />

          {faqs.length > 0 ? (
            <div style={{ maxWidth: 680, margin: '3.5rem auto 0' }}>
              <h2 className="display" style={{ fontSize: 'var(--text-heading)', marginBottom: '1.2rem' }}>
                Frequently asked
              </h2>
              <div className="faq-list">
                {faqs.map((faq) => (
                  <details className="faq-item" key={faq.question} name="post-faq">
                    <summary>
                      <h3>{faq.question}</h3>
                      <span className="faq-marker" aria-hidden="true" />
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}

          {post.tags && post.tags.length > 0 ? (
            <div className="tag-row" style={{ maxWidth: 680, margin: '3rem auto 0' }}>
              {post.tags.map((t) => (
                <span key={t.id}>{t.tag}</span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-tight on-dark deep">
        <div className="container cta-band">
          <h2 className="display inv" style={{ fontSize: 'var(--text-display-s)' }}>
            A question this piece did not answer?
          </h2>
          <Link href="/contact#enquiry" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </article>
  )
}
