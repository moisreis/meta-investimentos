import { PRESENTER_FALLBACK } from "../constants/presenter.constants"

/**
 * @summary
 * Formats a date value for display in Brazilian Portuguese
 * locale.
 *
 * @remarks
 * Converts a date-like value (ISO string, timestamp or
 * `Date`) into a short `dd/mm/yyyy` string. Returns the
 * fallback for nil or invalid values.
 *
 * @explanation
 * Use this function to display dates in the UI with proper
 * Brazilian formatting. It parses strings and numbers before
 * formatting. Call it in tables, detail views or any
 * component rendering a date.
 *
 * @param value - The raw date-like value to format.
 * @returns Formatted date string or fallback.
 *
 * @example
 * const DATE = FormatDate("2026-09-24T10:00:00Z");
 * // returns "24/09/2026"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export function FormatDate(
  value: string | number | Date | null | undefined
): string {
  const DATE = toDate(value)

  if (!DATE) return PRESENTER_FALLBACK

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(DATE)
}

/**
 * @summary
 * Formats a date-time value for display in Brazilian
 * Portuguese locale.
 *
 * @remarks
 * Converts a date-like value (ISO string, timestamp or
 * `Date`) into a short `dd/mm/yyyy hh:mm` string. Returns
 * the fallback for nil or invalid values.
 *
 * @explanation
 * Use this function to display timestamps (such as updated
 * dates) in the UI. The time portion omits seconds to keep
 * the column compact.
 *
 * @param value - The raw date-time value to format.
 * @returns Formatted date-time string or fallback.
 *
 * @example
 * const DATE_TIME = FormatDateTime("2026-09-24T10:30:00Z");
 * // returns "24/09/2026 10:30"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export function FormatDateTime(
  value: string | number | Date | null | undefined
): string {
  const DATE = toDate(value)

  if (!DATE) return PRESENTER_FALLBACK

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(DATE)
}

/**
 * Parses a date-like value into a valid `Date`, or null.
 */
function toDate(
  value: string | number | Date | null | undefined
): Date | null {
  if (value === null || value === undefined) return null

  const DATE = value instanceof Date ? value : new Date(value)

  return Number.isNaN(DATE.getTime()) ? null : DATE
}
