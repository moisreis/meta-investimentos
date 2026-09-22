import { SignedPercentage } from "@/value-objects"

interface CalculatePortfolioMarketSpreadProps {
  portfolioReturn: SignedPercentage
  marketRate: SignedPercentage
}

/**
 * @summary
 * Calculates the market spread for a Portfolio.
 *
 * @remarks
 * Subtracts the monthly **Ibovespa** market index from
 * the portfolio return.
 * Result is rounded to 2 decimal places.
 *
 * @explanation
 * Use this function to measure portfolio performance against
 * the market benchmark. Positive means portfolio outperformed
 * the market index.
 *
 * @param portfolioReturn - Portfolio return for period (%).
 * @param marketRate - Monthly market index **Ibovespa** (%).
 *
 * @returns The market spread.
 *
 * @example
 * const RESULT = calculatePortfolioMarketSpread({
 *   portfolioReturn: SignedPercentage.create("1.04"),
 *   marketRate: SignedPercentage.create("1.20"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioMarketSpread({
  portfolioReturn,
  marketRate,
}: CalculatePortfolioMarketSpreadProps): SignedPercentage {
  return SignedPercentage.create(portfolioReturn.value.minus(marketRate.value))
}
