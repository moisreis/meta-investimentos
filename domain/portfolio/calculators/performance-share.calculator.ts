import Decimal from "decimal.js"

interface CalculatePerformanceShareProps {
  // The figure being read against the reference, in percent.
  value: string | null
  // The reference the value is read against, in percent.
  reference: string | null
}

/**
 * @summary
 * Calculates how much a figure represents of a reference.
 *
 * @remarks
 * Divides the value by a strictly positive reference and
 * scales it to percent, rounding to 2 decimal places. Returns
 * `null` when either side is missing or the reference is not
 * positive, so a missing denominator never resolves to a
 * fabricated ratio. A negative value keeps its sign, so an
 * underperforming portfolio reads below zero.
 *
 * @explanation
 * Use this function to read the portfolio return against the
 * target and against each reference index of the statement
 * report. It mirrors the `yearly_return / index_ytd * 100`
 * guard of the monthly report generator.
 *
 * @param props - The value and the reference, in percent.
 *
 * @returns The share of the reference, in percent, or `null`.
 *
 * @example
 * const SHARE = calculatePerformanceShare({
 *   value: "8.20",
 *   reference: "5.00",
 * }); // "164.00"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-09
 */
export function calculatePerformanceShare({
  value,
  reference,
}: CalculatePerformanceShareProps): string | null {
  if (value === null || reference === null) return null

  const BASE = new Decimal(reference)
  if (!BASE.greaterThan(0)) return null

  return new Decimal(value).dividedBy(BASE).times(100).toFixed(2)
}
