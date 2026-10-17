import { SignedPercentage } from "@/value-objects"

import { calculatePortfolioCumulativeTarget } from "./cumulative-target.calculator"
import { calculatePortfolioTarget } from "./target.calculator"

interface CalculateAccumulatedTargetProps {
  // Annual interest rate the portfolio compounds against
  // each elapsed month, in percent, as a decimal string.
  annualInterestRate: string
  // The inflation index (**IPCA**) of each elapsed month, in
  // percent, in chronological order. A `null` marks an
  // elapsed month without a reading.
  inflationRates: readonly (string | null)[]
}

/**
 * @summary
 * Calculates the accumulated Target of a Portfolio over the
 * elapsed months of a window.
 *
 * @remarks
 * Compounds the monthly Target of every month that holds an
 * inflation reading, in chronological order, and skips the
 * months without one so a thin history still resolves a
 * figure. Returns `null` when no month holds a reading, so an
 * unregistered series never resolves to a fabricated zero.
 * This mirrors the `meta_ytd` accumulation of the monthly
 * report generator, which compounds whatever readings the
 * year holds.
 *
 * @explanation
 * Use this calculator to resolve the accumulated target of
 * the statement report when the stored cumulative target is
 * missing because a month of the year carries no reading.
 * Unlike the strict chain of the daily performance
 * calculation, a missing month is skipped instead of
 * voiding the whole figure.
 *
 * @param props - The annual rate and the monthly readings.
 *
 * @returns The accumulated target, in percent, or `null`.
 *
 * @example
 * const TARGET = calculateAccumulatedTarget({
 *   annualInterestRate: "0.45",
 *   inflationRates: [null, "3.00", "0.82"],
 * }); // "3.93"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function calculateAccumulatedTarget({
  annualInterestRate,
  inflationRates,
}: CalculateAccumulatedTargetProps): string | null {
  const ANNUAL_INTEREST_RATE = SignedPercentage.create(
    annualInterestRate
  )

  const MONTHLY_TARGETS: { value: SignedPercentage }[] = []

  for (const RATE of inflationRates) {
    if (RATE === null) continue

    MONTHLY_TARGETS.push({
      value: calculatePortfolioTarget({
        annualInterestRate: ANNUAL_INTEREST_RATE,
        inflationRate: SignedPercentage.create(RATE),
      }),
    })
  }

  if (MONTHLY_TARGETS.length === 0) return null

  return calculatePortfolioCumulativeTarget({
    monthlyTargets: MONTHLY_TARGETS,
  }).value.toFixed(2)
}
