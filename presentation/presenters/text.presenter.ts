/**
 * @summary
 * Presentation helpers for plain text values.
 *
 * @remarks
 * Collapses nil, blank and zero values to `-` and exports
 * the single-line clamp class used to truncate long text
 * to one line. The presenter performs no other
 * transformation on the text.
 *
 * @explanation
 * Use this presenter in the presentation layer for text
 * cells and labels so truncated and empty text renders
 * consistently across the application.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */

const FALLBACK = "-"

/**
 * Tailwind class that truncates text to a single line.
 */
export const TEXT_LINE_CLAMP_CLASS = "line-clamp-1"

/**
 * Formats a text value for display.
 *
 * @param value - The raw text value.
 * @returns `-` when the value is nil, blank or `0`;
 *          otherwise the untrimmed text.
 */
export function formatText(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return FALLBACK

  const text = String(value)

  if (text.trim() === "" || text === "0") return FALLBACK

  return text
}
