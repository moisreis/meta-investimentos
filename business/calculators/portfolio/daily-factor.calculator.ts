import GrowthFactor from "@/business/value-objects/growth-factor.vo";
import type SignedMoney from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to calculate
 * the daily growth factor of a portfolio.
 *
 * The current and previous day portfolio values represent
 * the total market value of the portfolio on the respective
 * business days, aggregated across all positions, and are
 * represented by {@link SignedMoney}.
 *
 * The current day cash flow is represented by {@link SignedMoney}
 * and may be positive, zero, or negative.
 */
interface CalculatePortfolioDailyFactorProps {
  currentDayPortfolioValue: SignedMoney;
  currentDayCashFlow: SignedMoney;
  previousDayPortfolioValue: SignedMoney;
}

/**
 * Calculates the daily growth factor of a portfolio based on
 * the current and previous day portfolio values and the current
 * day net cash flow.
 *
 * The calculation accounts for the current day cash flow and
 * compares the resulting adjusted current day portfolio value
 * against the previous day portfolio value.
 *
 * The result is represented as a {@link GrowthFactor}.
 *
 * @param currentDayPortfolioValue - The current day total
 * portfolio value.
 * @param currentDayCashFlow - The current day net cash flow
 * of the portfolio.
 * @param previousDayPortfolioValue - The previous day total
 * portfolio value.
 *
 * @returns The calculated daily growth factor of the portfolio.
 *
 * @equation (Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioDailyFactor({
 *   currentDayPortfolioValue: SignedMoney.create('11177402.62'),
 *   currentDayCashFlow: SignedMoney.create('5100000'),
 *   previousDayPortfolioValue: SignedMoney.create('6072211.64'),
 * })
 *
 * RESULT.value.toString()
 * // '1.00085487'
 * ```
 */
export function calculatePortfolioDailyFactor({
  currentDayPortfolioValue,
  currentDayCashFlow,
  previousDayPortfolioValue,
}: CalculatePortfolioDailyFactorProps): GrowthFactor {
  return GrowthFactor.create(
    currentDayPortfolioValue.value
      .minus(currentDayCashFlow.value)
      .dividedBy(previousDayPortfolioValue.value),
  );
}
