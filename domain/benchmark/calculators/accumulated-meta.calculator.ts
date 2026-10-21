import Decimal from "decimal.js"

import { ValidationError } from "@/errors"

interface CalculateAccumulatedMetaProps {
  // Annual interest rate the portfolio compounds against
  // each elapsed month, in percent, as a decimal string.
  annualInterestRate: string
  // The **IPCA** reading of each elapsed month, in percent,
  // in chronological order. A `null` marks an elapsed month
  // without a reading.
  inflationRates: readonly (string | null)[]
}

/**
 * @summary
 * Resolves the accumulated meta of a Portfolio over the
 * elapsed months of a window.
 *
 * @remarks
 * The meta of a month is the monthly portfolio rate
 * `i_m = (1 + i_a)^(1/12) - 1` plus the month **IPCA**
 * reading, added and never compounded against each other.
 * The accumulation compounds the monthly metas at full
 * precision and rounds the final figure only, because
 * compounding the two-decimal display of each month drifts
 * the year away from the statement. A month without a
 * reading is skipped, so a thin history still resolves a
 * figure, and no reading at all resolves to `null` instead
 * of a fabricated zero. Throws when the annual interest
 * rate is below -100%.
 *
 * @explanation
 * Use this function to resolve the meta the statement
 * report measures the year against: the dashboard gauge,
 * the dashboard index comparison and the accumulated
 * indices section all read it. The report computes it from
 * the annual rate and the **IPCA** series instead of the
 * stored snapshot figures, which carry the meta the
 * portfolio was registered with when the calculation ran.
 *
 * @param props - The annual rate and the monthly readings.
 * @returns The accumulated meta, or `null`.
 *
 * @example
 * const META = calculateAccumulatedMeta({
 *   annualInterestRate: "5.19",
 *   inflationRates: [null, "0.33", "0.82"],
 * }); // "2.00"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export function calculateAccumulatedMeta({
  annualInterestRate,
  inflationRates,
}: CalculateAccumulatedMetaProps): string | null {
  const ANNUAL = ToRate(annualInterestRate)

  let FACTOR = new Decimal(1)
  let READINGS = 0

  for (const RATE of inflationRates) {
    if (RATE === null) continue

    READINGS += 1
    FACTOR = FACTOR.times(
      new Decimal(1).plus(MonthlyMeta(ANNUAL, ToRate(RATE)))
    )
  }

  if (READINGS === 0) return null

  return FACTOR.minus(1).times(100).toFixed(2)
}

/**
 * @summary
 * The meta of one month, as a decimal fraction, kept
 * unrounded so the accumulation never compounds a figure
 * the display already rounded.
 *
 * @remarks
 * Applies the same rule the daily performance calculation
 * stores on each snapshot: the monthly portfolio rate
 * `i_m = (1 + i_a)^(1/12) - 1` plus the month **IPCA**.
 *
 * @param annualRate - The annual rate, in percent.
 * @param inflationRate - The month **IPCA**, in percent.
 * @returns The monthly meta, as a fraction.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function MonthlyMeta(
  annualRate: Decimal,
  inflationRate: Decimal
): Decimal {
  const BASE = new Decimal(1).plus(annualRate.dividedBy(100))

  if (BASE.lessThan(0)) {
    throw new ValidationError(
      "`Meta` cannot be calculated below -100%."
    )
  }

  return BASE.toPower(1 / 12)
    .minus(1)
    .plus(inflationRate.dividedBy(100))
}

/**
 * @summary
 * Parses a rate string into a finite **Decimal**.
 *
 * @remarks
 * Throws a `ValidationError` on a malformed reading, so a
 * single bad **IPCA** row never resolves to `NaN`.
 *
 * @param value - The rate, in percent, as a string.
 * @returns The parsed rate.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function ToRate(value: string): Decimal {
  try {
    const RATE = new Decimal(value)
    if (!RATE.isFinite()) throw new Error()
    return RATE
  } catch {
    throw new ValidationError(
      "`Meta` rates must be finite numbers."
    )
  }
}
