import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the inputs required to calculate
 * the risk-free spread of a Portfolio for a given period.
 *
 * The Portfolio return is represented by {@link SignedPercentage},
 * while the risk-free index is represented by {@link SignedPercentage}
 * and expresses the monthly risk-free index (CDI).
 */
interface CalculatePortfolioRiskFreeSpreadProps {
  portfolioReturn: SignedPercentage;
  riskFreeRate: SignedPercentage;
}

/**
 * Calculates the risk-free spread of a Portfolio,
 * representing the difference between the Portfolio return
 * and the risk-free index (CDI) for a given period.
 *
 * The result is expressed as a percentage, rounded to
 * 2 decimal places, and represented as a {@link SignedPercentage}.
 *
 * @param portfolioReturn - The Portfolio return for the period,
 * in percentage terms.
 * @param riskFreeRate - The monthly risk-free index (CDI),
 * in percentage terms.
 *
 * @returns The calculated risk-free spread of the Portfolio.
 *
 * @equation Sₜᵖ = Rₜᵖ − fₜ
 *
 * @example
 * const RESULT = calculatePortfolioRiskFreeSpread({
 *   portfolioReturn: SignedPercentage.create('1.04'),
 *   riskFreeRate: SignedPercentage.create('0.95'),
 * })
 *
 * RESULT.value.toString()
 * // '0.09'
 */
export function calculatePortfolioRiskFreeSpread({
  portfolioReturn,
  riskFreeRate,
}: CalculatePortfolioRiskFreeSpreadProps): SignedPercentage {
  return SignedPercentage.create(
    portfolioReturn.value.minus(riskFreeRate.value),
  );
}
