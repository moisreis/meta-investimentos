/**
 * @summary
 * Converts a `YYYY-MM` month key into a UTC period range.
 *
 * @remarks
 * Starts on the first day of the month and ends on the last
 * day of the same month at 23:59:59.999 UTC. The statement
 * stores the period as `date` columns, so both bounds are
 * serialized through UTC ISO strings.
 *
 * @param month - The month key to convert.
 *
 * @returns The period start and end ISO strings.
 *
 * @example
 * const PERIOD = BuildStatementPeriod("2026-01");
 * // { periodStart: "2026-01-01T00:00:00.000Z",
 * //   periodEnd: "2026-01-31T23:59:59.999Z" }
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildStatementPeriod(month: string): {
  periodStart: string
  periodEnd: string
} {
  const [YEAR, MONTH_NUMBER] = month.split("-").map(Number)
  const START = new Date(Date.UTC(YEAR, MONTH_NUMBER - 1, 1))
  const END = new Date(
    Date.UTC(YEAR, MONTH_NUMBER, 0, 23, 59, 59, 999)
  )

  return {
    periodStart: START.toISOString(),
    periodEnd: END.toISOString(),
  }
}
