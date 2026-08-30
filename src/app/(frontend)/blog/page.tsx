import type { Metadata } from 'next'
import Link from 'next/link'

import { PostCard } from '@/components/PostCard'
import { Reveal } from '@/components/Reveal'
import { getPosts } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'News & Blogs',
  description:
    'Guides, market notes and firm news from A2S Estates: builder floors, documentation, localities and the practical side of South Delhi property.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const result = await getPosts({ page, limit: 9 })

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="label">News &amp; Blogs</span>
          <h1>
            Notes from the <em style={{ lineHeight: 1.12 }}>ground.</em>
          </h1>
          <p>
            What we learn walking South Delhi&rsquo;s floors, written down: buying guides, documentation
            practice and the occasional piece of firm news.
          </p>
        </div>
      </section>

      <section className="section bg-bone">
        <div className="container">
          {result.docs.length > 0 ? (
            <div className="post-grid">
              {result.docs.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.07}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p style={{ padding: '3rem 0' }}>Articles are on their way. In the meantime, tell us what you would like to read about.</p>
          )}

          {result.totalPages > 1 ? (
            <nav className="pagination" aria-label="Pagination">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span key={n} className="current" aria-current="page">
                    {n}
                  </span>
                ) : (
                  <Link key={n} href={`/blog?page=${n}`}>
                    {n}
                  </Link>
                ),
              )}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  )
}
