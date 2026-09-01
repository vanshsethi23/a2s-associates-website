export type Block = { type: 'h2' | 'h3' | 'p'; text: string }

const textNode = (text: string) => ({
  type: 'text',
  text,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

/**
 * Pulls the plain text out of a stored Lexical document, for word counts and
 * other metadata. Walks the tree rather than assuming a flat shape, since
 * editors can nest lists and quotes.
 */
export const lexicalToPlainText = (data: unknown): string => {
  const parts: string[] = []
  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: unknown; children?: unknown; root?: unknown }
    if (n.root) walk(n.root)
    if (typeof n.text === 'string') parts.push(n.text)
    if (Array.isArray(n.children)) n.children.forEach(walk)
  }
  walk(data)
  return parts.join(' ')
}

/** Converts flat blocks into the Lexical shape Payload's richText stores. */
export const toLexical = (blocks: Block[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: blocks.map((b) =>
      b.type === 'p'
        ? {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            textFormat: 0,
            children: [textNode(b.text)],
          }
        : {
            type: 'heading',
            tag: b.type,
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [textNode(b.text)],
          },
    ),
  },
})
