import Decimal from "decimal.js"

import { type GrowthFactor, SignedPercentage } from "@/value-objects"

interface CalculatePortfolioReturnProps {
  dailyGrowthFactors: { value: GrowthFactor }[]
}

/**
 * @summary
 * Calculates the Time-Weighted Return for a Portfolio.
 *
 * @remarks
 * Chains daily growth factors to compute cumulative return.
 * Result is rounded to 2 decimal places as SignedPercentage.
 *
 * @explanation
 * Use this function to measure portfolio performance over a
 * period. It neutralizes cash flow effects by using daily
 * growth factors that already incorporate daily flows.
 *
 * @param dailyGrowthFactors - Daily growth factors in
 *   chronological order.
 * @returns The cumulative return.
 *
 * @example
 * const RESULT = calculatePortfolioReturn({
 *   dailyGrowthFactors: [
 *     { value: GrowthFactor.create("1.00024821") },
 *     { value: GrowthFactor.create("1.00076410") },
 *     { value: GrowthFactor.create("1.00040729") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioReturn({
  dailyGrowthFactors,
}: CalculatePortfolioReturnProps): SignedPercentage {
  const CUMULATIVE_FACTOR = dailyGrowthFactors.reduce(
    (acc, dailyGrowthFactor) => acc.times(dailyGrowthFactor.value.value),
    new Decimal(1)
  )

  const RETURN_RATE_PERCENTAGE = CUMULATIVE_FACTOR.minus(1).times(100)

  return SignedPercentage.create(RETURN_RATE_PERCENTAGE)
}
