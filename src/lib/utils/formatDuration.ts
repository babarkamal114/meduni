/**
 * Formats a duration string for display: "1" → "1 hour", "2" → "2 hours".
 * Non-numeric values (e.g. "TBA", "90 min") are returned as-is.
 */
export function formatDuration(duration: string): string {
  const trimmed = duration.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return duration;
  const num = parseFloat(trimmed);
  return num === 1 ? '1 hour' : `${num} hours`;
}
