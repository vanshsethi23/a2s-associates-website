import { revalidatePath } from 'next/cache'

/**
 * Revalidates the public pages affected by a CMS change so edits in the
 * admin panel reflect on the live site without a redeploy.
 */
export const revalidateSite = (paths: string[]): void => {
  try {
    for (const path of paths) revalidatePath(path)
  } catch {
    // revalidatePath is unavailable outside the Next.js runtime (e.g. seed scripts)
  }
}
