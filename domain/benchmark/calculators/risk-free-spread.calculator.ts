import { SignedPercentage } from "@/value-objects"

interface CalculatePortfolioRiskFreeSpreadProps {
  portfolioReturn: SignedPercentage
  riskFreeRate: SignedPercentage
}

/**
 * @summary
 * Calculates the risk-free spread for a Portfolio.
 *
 * @remarks
 * Subtracts the monthly **CDI** rate from the portfolio return.
 * Result is rounded to 2 decimal places.
 *
 * @explanation
 * Use this function to measure portfolio performance against
 * the risk-free benchmark. Positive means portfolio outperformed
 * the risk-free rate.
 *
 * @param portfolioReturn - Portfolio return for period (%).
 * @param riskFreeRate - Monthly risk-free index **CDI** (%).
 *
 * @returns The risk-free spread.
 *
 * @example
 * const RESULT = calculatePortfolioRiskFreeSpread({
 *   portfolioReturn: SignedPercentage.create("1.04"),
 *   riskFreeRate: SignedPercentage.create("0.95"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioRiskFreeSpread({
  portfolioReturn,
  riskFreeRate,
}: CalculatePortfolioRiskFreeSpreadProps): SignedPercentage {
  return SignedPercentage.create(
    portfolioReturn.value.minus(riskFreeRate.value)
  )
}
