import Image from 'next/image'
import Link from 'next/link'

import { asMedia, mediaUrl } from '@/lib/data'
import type { Post } from '@/payload-types'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export function PostCard({ post }: { post: Post }) {
  const img = asMedia(post.featuredImage)
  const url = mediaUrl(img, 'card')
  const category = post.category && typeof post.category === 'object' ? post.category.title : null

  return (
    <Link href={`/blog/${post.slug}`} className="post-card">
      {/* Articles publish before their image is added by hand, so the empty
          state is a deliberate brand panel rather than a blank grey box. */}
      <span className={`post-card-media${url ? '' : ' is-empty'}`}>
        {url ? (
          <Image
            src={url}
            alt={img?.alt || post.title}
            width={img?.sizes?.card?.width || 900}
            height={img?.sizes?.card?.height || 600}
            sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <Image
            src="/brand/logo-mark-dark.png"
            alt=""
            width={512}
            height={512}
            aria-hidden="true"
            className="post-card-mark"
          />
        )}
      </span>
      <span className="post-card-meta">
        {category ? <span className="cat">{category}</span> : null}
        {post.publishedDate ? <time dateTime={post.publishedDate}>{dateFmt.format(new Date(post.publishedDate))}</time> : null}
      </span>
      <h3>{post.title}</h3>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
    </Link>
  )
}
