import Decimal from "decimal.js"

import { SignedPercentage } from "@/value-objects"

interface CalculatePortfolioCumulativeTargetProps {
  monthlyTargets: { value: SignedPercentage }[]
}

/**
 * @summary
 * Calculates the cumulative Target of a Portfolio.
 *
 * @remarks
 * Chains monthly Target factors to compute cumulative value.
 * Result is rounded to 2 decimal places as SignedPercentage.
 *
 * @explanation
 * Use this function to compute the Portfolio's cumulative
 * target return over multiple months. It compounds each
 * monthly target factor in chronological order.
 *
 * @param monthlyTargets - Monthly Target factors in
 *   chronological order.
 * @returns The cumulative target.
 *
 * @example
 * const RESULT = calculatePortfolioCumulativeTarget({
 *   monthlyTargets: [
 *     { value: SignedPercentage.create("3.57") },
 *     { value: SignedPercentage.create("2.91") },
 *     { value: SignedPercentage.create("3.44") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioCumulativeTarget({
  monthlyTargets,
}: CalculatePortfolioCumulativeTargetProps): SignedPercentage {
  const CUMULATIVE_FACTOR = monthlyTargets.reduce(
    (acc, monthlyTarget) =>
      acc.times(new Decimal(1).plus(monthlyTarget.value.value.dividedBy(100))),
    new Decimal(1)
  )

  return SignedPercentage.create(CUMULATIVE_FACTOR.minus(1).times(100))
}
