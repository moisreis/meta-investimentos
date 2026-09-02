import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the inputs required to calculate
 * the inflation spread of a Portfolio for a given period.
 *
 * The Portfolio return is represented by {@link SignedPercentage},
 * while the inflation index is represented by {@link SignedPercentage}
 * and expresses the monthly inflation index (IPCA).
 */
interface CalculatePortfolioInflationSpreadProps {
  portfolioReturn: SignedPercentage;
  inflationRate: SignedPercentage;
}

/**
 * Calculates the inflation spread of a Portfolio,
 * representing the difference between the Portfolio return
 * and the inflation index (IPCA) for a given period.
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param portfolioReturn - The Portfolio return for the
 *                          period, in percentage terms.
 * @param inflationRate - The monthly inflation index (IPCA),
 *                        in percentage terms.
 *
 * @returns The calculated inflation spread of the Portfolio.
 *
 * @equation Sₜᵖ = Rₜᵖ − πₜ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioInflationSpread({
 *   portfolioReturn: SignedPercentage.create('1.04'),
 *   inflationRate: SignedPercentage.create('0.45'),
 * })
 *
 * RESULT.value.toString()
 * // '0.59'
 * ```
 */
export function calculatePortfolioInflationSpread({
  portfolioReturn,
  inflationRate,
}: CalculatePortfolioInflationSpreadProps): SignedPercentage {
  return SignedPercentage.create(
    portfolioReturn.value.minus(inflationRate.value),
  );
}
