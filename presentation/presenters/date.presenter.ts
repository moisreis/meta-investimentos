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
 * Formats a date-only value for display in Brazilian
 * Portuguese locale, in UTC.
 *
 * @remarks
 * `FormatDate` renders in the runtime timezone, which turns
 * a UTC midnight bound (such as the first day of a statement
 * period) into the previous day west of Greenwich. A period
 * bound is a date, not an instant, so it must be read on the
 * calendar it was stored in. Returns the fallback for nil or
 * invalid values.
 *
 * @explanation
 * Use this function for date-only values, such as the period
 * bounds of a statement. Keep `FormatDate` for instants the
 * reader expects in their own timezone.
 *
 * @param value - The raw date-like value to format.
 * @returns Formatted date string or fallback.
 *
 * @example
 * const DATE = FormatUtcDate("2026-08-01T00:00:00.000Z");
 * // returns "01/08/2026"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function FormatUtcDate(
  value: string | number | Date | null | undefined
): string {
  const DATE = toDate(value)

  if (!DATE) return PRESENTER_FALLBACK

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
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
/**
 * @summary
 * Formats a date as the month and year it belongs to, in
 * Brazilian Portuguese locale.
 *
 * @remarks
 * Converts a date-like value (ISO string, timestamp or
 * `Date`) into a long month name with its year, such as
 * `Setembro de 2026`. The month name is capitalised because it
 * starts a label rather than a sentence, and `Intl` lower-cases
 * it in this locale. Returns the fallback for nil or invalid
 * values.
 *
 * @explanation
 * Use for a field whose value is a whole month, such as the
 * reporting period of a statement. A day picker is the usual
 * way to choose one, so the day that gets clicked is discarded
 * and only the month it falls in is shown.
 *
 * @param value - The raw date-like value to format.
 * @returns The formatted month, or the fallback.
 *
 * @example
 * const MONTH = FormatMonth("2026-09-24T10:00:00Z");
 * // returns "Setembro de 2026"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function FormatMonth(
  value: string | number | Date | null | undefined
): string {
  const DATE = toDate(value)

  if (!DATE) return PRESENTER_FALLBACK

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  })
    .format(DATE)
    .replace(/^./, (char) => char.toUpperCase())
}

/**
 * @summary
 * Formats a date as a month name and its year, joined with
 * a comma.
 *
 * @remarks
 * Converts a date-like value (ISO string, timestamp or
 * `Date`) into a long month name with its year, such as
 * `Agosto, 2026`. The month name is capitalised because it
 * starts a label rather than a sentence, and `Intl`
 * lower-cases it in this locale. It reads the value in UTC,
 * like `FormatUtcDate`, so a period bound stored at UTC
 * midnight never drifts into the neighbouring month west of
 * Greenwich. Returns the fallback for nil or invalid values.
 *
 * @explanation
 * Use for a field whose value is a whole month, such as the
 * reference period of a statement, when the label wants the
 * month first and the year after a comma instead of the `de`
 * connector of `FormatMonth`. A day picker is the usual way
 * to choose one, so the day that gets clicked is discarded
 * and only the month it falls in is shown.
 *
 * @param value - The raw date-like value to format.
 * @returns The formatted `Month, Year`, or the fallback.
 *
 * @example
 * const MONTH = FormatMonthYear("2026-08-31T00:00:00.000Z");
 * // returns "Agosto, 2026"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-07
 */
export function FormatMonthYear(
  value: string | number | Date | null | undefined
): string {
  const DATE = toDate(value)

  if (!DATE) return PRESENTER_FALLBACK

  const MONTH_NAME = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "UTC",
  }).format(DATE)

  return `${MONTH_NAME.replace(/^./, (char) => char.toUpperCase())}, ${DATE.getUTCFullYear()}`
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
