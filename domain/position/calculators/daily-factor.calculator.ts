import {
  GrowthFactor,
  type QuotaPrice,
  type QuotaQuantity,
  type SignedMoney,
} from "@/value-objects"
import { ValidationError } from "@/errors"

interface CalculateDailyFactorProps {
  currentDayQuotaValue: QuotaPrice
  currentDayQuotaQuantity: QuotaQuantity
  currentDayCashFlow: SignedMoney
  previousDayQuotaValue: QuotaPrice
  previousDayQuotaQuantity: QuotaQuantity
}

/**
 * @summary
 * Calculates the daily growth factor for a position.
 *
 * @remarks
 * Uses current/previous quota values, quantities, and cash flow.
 * Throws if previous day value or quantity is zero.
 *
 * @explanation
 * Use this function each business day to compute the growth
 * factor that feeds into Time-Weighted Return. It adjusts the
 * current day value by cash flow before comparing to previous.
 *
 * @param currentDayQuotaValue - Current day quota price.
 * @param currentDayQuotaQuantity - Current day quota quantity.
 * @param currentDayCashFlow - Current day net cash flow.
 * @param previousDayQuotaValue - Previous day quota price.
 * @param previousDayQuotaQuantity - Previous day quota quantity.
 *
 * @returns GrowthFactor instance.
 *
 * @example
 * const RESULT = calculateDailyFactor({
 *   currentDayQuotaValue: QuotaPrice.create("4.424818"),
 *   currentDayQuotaQuantity:
 *     QuotaQuantity.create("342021.111191"),
 *   currentDayCashFlow: SignedMoney.create("0"),
 *   previousDayQuotaValue: QuotaPrice.create("4.423720"),
 *   previousDayQuotaQuantity:
 *     QuotaQuantity.create("342021.111191"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateDailyFactor({
  currentDayQuotaValue,
  currentDayQuotaQuantity,
  currentDayCashFlow,
  previousDayQuotaValue,
  previousDayQuotaQuantity,
}: CalculateDailyFactorProps): GrowthFactor {
  const PREVIOUS_DAY_VALUE =
    previousDayQuotaQuantity.value.times(
      previousDayQuotaValue.value
    )

  if (PREVIOUS_DAY_VALUE.isZero()) {
    throw new ValidationError(
      "Daily factor cannot be calculated with a zero previous day quota value."
    )
  }

  return GrowthFactor.create(
    currentDayQuotaValue.value
      .times(currentDayQuotaQuantity.value)
      .minus(currentDayCashFlow.value)
      .dividedBy(PREVIOUS_DAY_VALUE)
  )
}
