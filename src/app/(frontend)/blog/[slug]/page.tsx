import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichTextContent } from '@/components/RichTextContent'
import { asMedia, getPostBySlug, mediaUrl } from '@/lib/data'

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedDate || undefined,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.author || 'A2S Estates' },
    image: imgUrl || undefined,
    description: post.excerpt || undefined,
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
