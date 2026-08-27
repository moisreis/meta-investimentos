import Decimal from "decimal.js";

import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the inputs required to calculate
 * the cumulative value of a reference index for a
 * given period.
 *
 * Each monthly index value is represented by an object
 * wrapping a {@link SignedPercentage}, one for each month
 * within the period being evaluated.
 */
interface CalculatePortfolioCumulativeBenchmarkProps {
  monthlyIndexValues: { value: SignedPercentage }[];
}

/**
 * Calculates the cumulative value of a reference index
 * up to a given period, obtained by chaining the monthly
 * values of the index.
 *
 * The reference index may be the inflation index (IPCA),
 * the risk-free index (CDI), or the market index (Ibovespa).
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param monthlyIndexValues - The monthly values of the reference
 * index for the period, in chronological order.
 *
 * @returns The calculated cumulative value of the reference index.
 *
 * @equation BR̄ₜ = ∏ₖ₌₁..ₜ (1 + BRₖ) − 1
 *
 * @example
 * const RESULT = calculatePortfolioCumulativeBenchmark({
 *   monthlyIndexValues: [
 *     { value: SignedPercentage.create('0.45') },
 *     { value: SignedPercentage.create('0.42') },
 *     { value: SignedPercentage.create('0.51') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '1.39'
 */
export function calculatePortfolioCumulativeBenchmark({
  monthlyIndexValues,
}: CalculatePortfolioCumulativeBenchmarkProps): SignedPercentage {
  const CUMULATIVE_FACTOR = monthlyIndexValues.reduce(
    (acc, monthlyIndexValue) =>
      acc.times(
        new Decimal(1).plus(monthlyIndexValue.value.value.dividedBy(100)),
      ),
    new Decimal(1),
  );

  return SignedPercentage.create(CUMULATIVE_FACTOR.minus(1).times(100));
}
