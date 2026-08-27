import Decimal from "decimal.js";

import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the inputs required to calculate
 * the cumulative Target of a Portfolio for a given period.
 *
 * Each monthly Target factor is represented by an object
 * wrapping a {@link SignedPercentage}, one for each month
 * within the period being evaluated.
 */
interface CalculatePortfolioCumulativeTargetProps {
  monthlyTargets: { value: SignedPercentage }[];
}

/**
 * Calculates the cumulative Target of a Portfolio,
 * obtained by chaining the monthly Target factors.
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param monthlyTargets - The monthly Target factors for the period,
 * in chronological order.
 *
 * @returns The calculated cumulative Target of the Portfolio.
 *
 * @equation T̄ₜ = ∏ₖ₌₁..ₜ (1 + Tₖ) − 1
 *
 * @example
 * const RESULT = calculatePortfolioCumulativeTarget({
 *   monthlyTargets: [
 *     { value: SignedPercentage.create('3.57') },
 *     { value: SignedPercentage.create('2.91') },
 *     { value: SignedPercentage.create('3.44') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '10.25'
 */
export function calculatePortfolioCumulativeTarget({
  monthlyTargets,
}: CalculatePortfolioCumulativeTargetProps): SignedPercentage {
  const CUMULATIVE_FACTOR = monthlyTargets.reduce(
    (acc, monthlyTarget) =>
      acc.times(new Decimal(1).plus(monthlyTarget.value.value.dividedBy(100))),
    new Decimal(1),
  );

  return SignedPercentage.create(CUMULATIVE_FACTOR.minus(1).times(100));
}
