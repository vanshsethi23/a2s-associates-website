import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichTextContent({ data, className = 'rich-text' }: { data: unknown; className?: string }) {
  if (!data) return null
  return <RichText data={data as SerializedEditorState} className={className} />
}
