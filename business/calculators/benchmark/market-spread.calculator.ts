import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the inputs required to calculate
 * the market spread of a Portfolio for a given period.
 *
 * The Portfolio return is represented by {@link SignedPercentage},
 * while the market index is represented by {@link SignedPercentage}
 * and expresses the monthly market index (Ibovespa).
 */
interface CalculatePortfolioMarketSpreadProps {
  portfolioReturn: SignedPercentage;
  marketRate: SignedPercentage;
}

/**
 * Calculates the market spread of a Portfolio,
 * representing the difference between the Portfolio return
 * and the market index (Ibovespa) for a given period.
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param portfolioReturn - The Portfolio return for the
 *                          period, in percentage terms.
 * @param marketRate - The monthly market index (Ibovespa),
 *                     in percentage terms.
 *
 * @returns The calculated market spread of the Portfolio.
 *
 * @equation Sₜᵖ = Rₜᵖ − mₜ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioMarketSpread({
 *   portfolioReturn: SignedPercentage.create('1.04'),
 *   marketRate: SignedPercentage.create('1.20'),
 * })
 *
 * RESULT.value.toString()
 * // '-0.16'
 * ```
 */
export function calculatePortfolioMarketSpread({
  portfolioReturn,
  marketRate,
}: CalculatePortfolioMarketSpreadProps): SignedPercentage {
  return SignedPercentage.create(portfolioReturn.value.minus(marketRate.value));
}
