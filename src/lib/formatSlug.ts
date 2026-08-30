import type { FieldHook } from 'payload'

export const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

/**
 * Auto-generates a slug from the given fallback field when the slug is left
 * empty, and normalises whatever the editor types either way.
 */
export const slugField =
  (fallback: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return formatSlug(value)
    const source = data?.[fallback]
    if (typeof source === 'string' && source.length > 0) return formatSlug(source)
    return value
  }
