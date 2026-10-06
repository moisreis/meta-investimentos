/**
 * @summary
 * Converts a `YYYY-MM` reference month into the entry date.
 *
 * @remarks
 * The user picks a month, but the entry is stored on a `date`
 * column, so the month is anchored to its first day at UTC
 * midnight. Anchoring matters more than it looks: the column
 * sits under a unique pair of `(benchmark, date)`, so any
 * stable day-of-month choice turns the month into the identity
 * of the entry. Picking the first day keeps the stored date
 * readable in a query and matches the start bound the
 * statement period helper already builds from a month key.
 *
 * The value is returned as an ISO string because that is what
 * the action hands to the use case.
 *
 * @param month - The month key to convert.
 *
 * @returns The first day of the month as an ISO string.
 *
 * @example
 * const DATE = BuildBenchmarkHistoryDate("2026-01");
 * // returns "2026-01-01T00:00:00.000Z"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function BuildBenchmarkHistoryDate(
  month: string
): string {
  const [YEAR, MONTH_NUMBER] = month.split("-").map(Number)

  return new Date(
    Date.UTC(YEAR, MONTH_NUMBER - 1, 1)
  ).toISOString()
}
