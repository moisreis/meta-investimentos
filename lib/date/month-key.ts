/**
 * @summary
 * Helpers for the `YYYY-MM` month keys shared by the report
 * calculators.
 *
 * @remarks
 * Every key is derived in UTC, from the same day-key
 * convention the performance registry uses, so a snapshot
 * near midnight never falls into the wrong month. The
 * twelve keys of a year always come in order, so a chart of
 * the year keeps a stable axis even when a month holds no
 * snapshot.
 *
 * @explanation
 * Use these helpers to group snapshots by month and to
 * build the twelve month keys of a year for the statement
 * report series.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */

// Number of months in a year.
const MONTHS_IN_YEAR = 12

/**
 * @summary
 * Converts an ISO instant to its `YYYY-MM` month key.
 *
 * @remarks
 * Uses the UTC calendar month of the instant.
 *
 * @param instant - The ISO 8601 instant.
 *
 * @returns The `YYYY-MM` month key.
 *
 * @example
 * ToMonthKey("2026-07-31T12:00:00.000Z"); // "2026-07"
 */
export function ToMonthKey(instant: string): string {
  const DATE = new Date(instant)
  const YEAR = DATE.getUTCFullYear()
  const MONTH = String(DATE.getUTCMonth() + 1).padStart(2, "0")
  return `${YEAR}-${MONTH}`
}

/**
 * @summary
 * Builds the twelve month keys of a calendar year.
 *
 * @remarks
 * Always returns January to December, in order, even when
 * the year holds no snapshot in a given month, so a chart
 * of the year keeps a stable axis.
 *
 * @param year - The four digit year.
 *
 * @returns The twelve `YYYY-MM` keys, January first.
 *
 * @example
 * BuildYearMonthKeys(2026);
 * // ["2026-01", ..., "2026-12"]
 */
export function BuildYearMonthKeys(year: number): string[] {
  return Array.from({ length: MONTHS_IN_YEAR }, (_, index) => {
    const MONTH = String(index + 1).padStart(2, "0")
    return `${year}-${MONTH}`
  })
}
