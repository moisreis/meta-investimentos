// Portuguese month abbreviations shown on the table rows.
const STATEMENT_MONTH_ABBREVIATIONS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const

/**
 * @summary
 * Formats a statement period start into a month label.
 *
 * @remarks
 * Parses the `YYYY-MM` prefix of the ISO period start and
 * renders it as `MES/AAAA`, e.g. `JAN/2026`. Falls back to
 * the raw value when the prefix is not a valid month.
 *
 * @param periodStart - ISO date string of the period start.
 *
 * @returns The formatted month label.
 *
 * @example
 * const LABEL = FormatStatementPeriod("2026-01-15T00:00:00Z");
 * // returns "JAN/2026"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function FormatStatementPeriod(
  periodStart: string
): string {
  const [YEAR, MONTH] = periodStart
    .slice(0, 7)
    .split("-")
    .map(Number)

  if (!YEAR || !MONTH || MONTH < 1 || MONTH > 12) {
    return periodStart
  }

  return `${STATEMENT_MONTH_ABBREVIATIONS[MONTH - 1]}/${YEAR}`
}

/**
 * @summary
 * Extracts the `YYYY-MM` month key of a period start.
 *
 * @remarks
 * Cuts the ISO prefix so months can be tallied and compared
 * without time-zone normalization.
 *
 * @param periodStart - ISO date string of the period start.
 *
 * @returns The month key, e.g. `2026-01`.
 *
 * @example
 * const KEY = GetStatementMonthKey("2026-01-05T00:00:00Z");
 * // returns "2026-01"
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function GetStatementMonthKey(
  periodStart: string
): string {
  return periodStart.slice(0, 7)
}
