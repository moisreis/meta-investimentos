// An ISO 8601 instant always opens with its `YYYY-MM` day,
// which is the month key as long as the date was anchored to
// the first day at UTC midnight, as `BuildBenchmarkHistoryDate`
// does.
const ISO_MONTH_PATTERN = /^(\d{4})-(\d{2})/

// Reads the year and the month number of a stored instant.
function ToMonthParts(date: string): number[] {
  const [, YEAR, MONTH_NUMBER] =
    date.match(ISO_MONTH_PATTERN) ?? []

  return [Number(YEAR), Number(MONTH_NUMBER)]
}

/**
 * @summary
 * Reads back the `YYYY-MM` reference month of a stored entry.
 *
 * @remarks
 * The inverse of `BuildBenchmarkHistoryDate`, so the two never
 * disagree about which month a stored date names. That is what
 * lets an edit form seed the month picker with the month the
 * entry was recorded under instead of making the user pick it
 * again.
 *
 * The read is a prefix match rather than date arithmetic
 * because the stored instant is UTC midnight on the first day:
 * rebuilding a `Date` and reading its local month would report
 * the previous month to any reader west of Greenwich.
 *
 * @param date - The ISO date of the entry.
 *
 * @returns The month key of the entry, or an empty string when
 *          the date is unreadable.
 *
 * @example
 * const MONTH = BuildBenchmarkHistoryMonth(
 *   "2026-01-01T00:00:00.000Z"
 * );
 * // returns "2026-01"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function BuildBenchmarkHistoryMonth(
  date: string
): string {
  return date.match(/^(\d{4}-\d{2})/)?.[1] ?? ""
}

/**
 * @summary
 * Reads back the reference month of a stored entry as a
 * **local** date, ready to be formatted for display.
 *
 * @remarks
 * The stored instant is UTC midnight on the first day of its
 * month, which is the previous day for any reader west of
 * Greenwich. Handing that instant straight to a local date
 * formatter would therefore name the month before, so the month
 * is read as a key first and rebuilt as a local midnight.
 *
 * An unreadable date yields an invalid `Date`, which the date
 * presenters already fall back from.
 *
 * @param date - The ISO date of the entry.
 *
 * @returns A local date on the first day of the month.
 *
 * @example
 * const MONTH_DATE = BuildBenchmarkHistoryMonthDate(
 *   "2026-01-01T00:00:00.000Z"
 * );
 * // a local first of January 2026, not the 31st of December
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function BuildBenchmarkHistoryMonthDate(
  date: string
): Date {
  const [YEAR, MONTH_NUMBER] = ToMonthParts(date)

  return new Date(YEAR, MONTH_NUMBER - 1, 1)
}
