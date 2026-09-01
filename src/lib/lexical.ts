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
