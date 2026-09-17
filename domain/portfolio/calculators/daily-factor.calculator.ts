import { GrowthFactor, type SignedMoney } from "@/value-objects"
import { ValidationError } from "@/errors"

interface CalculatePortfolioDailyFactorProps {
  currentDayPortfolioValue: SignedMoney
  currentDayCashFlow: SignedMoney
  previousDayPortfolioValue: SignedMoney
}

/**
 * @summary
 * Calculates the daily growth factor for a Portfolio.
 *
 * @remarks
 * Uses aggregated portfolio values and cash flow.
 * Throws if previous day portfolio value is zero.
 *
 * @explanation
 * Use this function each business day to compute the
 * portfolio growth factor that feeds into Time-Weighted
 * Return. It adjusts the current day value by cash flow.
 *
 * @param currentDayPortfolioValue - Current day total portfolio value.
 * @param currentDayCashFlow - Current day net cash flow.
 * @param previousDayPortfolioValue - Previous day total portfolio value.
 * @returns GrowthFactor instance.
 *
 * @example
 * const RESULT = calculatePortfolioDailyFactor({
 *   currentDayPortfolioValue: SignedMoney.create("11177402.62"),
 *   currentDayCashFlow: SignedMoney.create("5100000"),
 *   previousDayPortfolioValue: SignedMoney.create("6072211.64"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioDailyFactor({
  currentDayPortfolioValue,
  currentDayCashFlow,
  previousDayPortfolioValue,
}: CalculatePortfolioDailyFactorProps): GrowthFactor {
  if (previousDayPortfolioValue.value.isZero()) {
    throw new ValidationError(
      "`Portfolio` daily factor cannot be calculated with a zero previous day value."
    )
  }

  return GrowthFactor.create(
    currentDayPortfolioValue.value
      .minus(currentDayCashFlow.value)
      .dividedBy(previousDayPortfolioValue.value)
  )
}
