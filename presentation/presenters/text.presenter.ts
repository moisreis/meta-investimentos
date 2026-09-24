import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

/**
 * @summary
 * Formats a text value for display.
 *
 * @remarks
 * Returns the fallback when the value is nil, blank, or `0`.
 * Otherwise returns the untrimmed text.
 *
 * @explanation
 * Use this function to safely display text values that may be
 * missing or empty. It prevents showing empty strings or zeros
 * in the UI. Call it in table cells, detail views, or any
 * component rendering optional text data.
 *
 * @param value - The raw text value to format.
 * @returns Formatted text or fallback string.
 *
 * @example
 * const TEXT = FormatText("Hello World");
 * // returns "Hello World"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export function FormatText(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined)
    return PRESENTER_FALLBACK

  const TEXT = String(value)

  if (TEXT.trim() === "" || TEXT === "0")
    return PRESENTER_FALLBACK

  return TEXT
}
