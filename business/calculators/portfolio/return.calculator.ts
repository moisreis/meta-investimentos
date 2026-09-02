import Decimal from "decimal.js";

import type { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the inputs required to calculate
 * the Time-Weighted Return of a portfolio for a given period.
 *
 * The daily growth factors are represented by an array
 * of objects wrapping a {@link GrowthFactor}, one for each
 * business day within the period being evaluated (a specific
 * day, month, year, or the trailing 12 months).
 */
interface CalculatePortfolioReturnProps {
  dailyGrowthFactors: { value: GrowthFactor }[];
}

/**
 * Calculates the rentability (Return) of a Portfolio over a given
 * period, using the Time-Weighted Return method.
 *
 * The Time-Weighted Return neutralizes the effect of external
 * cash flows by chaining the daily growth factors already
 * computed for each business day within the period — each
 * factor is expected to already account for that day's cash
 * flow (see {@link GrowthFactor}).
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param dailyGrowthFactors - The daily growth factors for
 *                             the period, in chronological
 *                             order.
 *
 * @returns The calculated portfolio return for the period, as a percentage.
 *
 * @equation Rₜᴾ = ( ∏_{k ∈ t} (Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ ) - 1
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioReturn({
 *   dailyGrowthFactors: [
 *     { value: GrowthFactor.create('1.00024821') },
 *     { value: GrowthFactor.create('1.00076410') },
 *     // ... remaining daily factors for the period
 *     { value: GrowthFactor.create('1.00040729') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '1.04'
 * ```
 */
export function calculatePortfolioReturn({
  dailyGrowthFactors,
}: CalculatePortfolioReturnProps): SignedPercentage {
  const CUMULATIVE_FACTOR = dailyGrowthFactors.reduce(
    (acc, dailyGrowthFactor) => acc.times(dailyGrowthFactor.value.value),
    new Decimal(1),
  );

  const RETURN_RATE_PERCENTAGE = CUMULATIVE_FACTOR.minus(1).times(100);

  return SignedPercentage.create(RETURN_RATE_PERCENTAGE);
}
