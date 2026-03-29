/**
 * Generates a URL-safe slug from a title (e.g. "Cardiology Update 2025" -> "cardiology-update-2025").
 */
export function titleToSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || '';
}
