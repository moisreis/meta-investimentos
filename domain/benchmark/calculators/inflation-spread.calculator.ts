import { SignedPercentage } from "@/value-objects"

interface CalculatePortfolioInflationSpreadProps {
  portfolioReturn: SignedPercentage
  inflationRate: SignedPercentage
}

/**
 * @summary
 * Calculates the inflation spread for a Portfolio.
 *
 * @remarks
 * Subtracts monthly inflation index (IPCA) from portfolio return.
 * Result is rounded to 2 decimal places.
 *
 * @explanation
 * Use this function to measure portfolio performance against
 * inflation. Positive means portfolio outperformed inflation.
 *
 * @param portfolioReturn - Portfolio return for period (%).
 * @param inflationRate - Monthly inflation index IPCA (%).
 * @returns SignedPercentage instance.
 *
 * @example
 * const RESULT = calculatePortfolioInflationSpread({
 *   portfolioReturn: SignedPercentage.create("1.04"),
 *   inflationRate: SignedPercentage.create("0.45"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioInflationSpread({
  portfolioReturn,
  inflationRate,
}: CalculatePortfolioInflationSpreadProps): SignedPercentage {
  return SignedPercentage.create(
    portfolioReturn.value.minus(inflationRate.value)
  )
}
