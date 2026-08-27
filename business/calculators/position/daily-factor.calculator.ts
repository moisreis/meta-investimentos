import GrowthFactor from "@/business/value-objects/growth-factor.vo";
import type QuotaPrice from "@/business/value-objects/quota-price.vo";
import type QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import type SignedMoney from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to calculate
 * the daily growth factor.
 *
 * The current and previous day quota values are represented
 * by {@link QuotaPrice}, while their respective quantities
 * are represented by {@link QuotaQuantity}.
 *
 * The current day cash flow is represented by {@link SignedMoney}
 * and may be positive, zero, or negative.
 */
interface CalculateDailyFactorProps {
  currentDayQuotaValue: QuotaPrice;
  currentDayQuotaQuantity: QuotaQuantity;
  currentDayCashFlow: SignedMoney;
  previousDayQuotaValue: QuotaPrice;
  previousDayQuotaQuantity: QuotaQuantity;
}

/**
 * Calculates the daily growth factor based on the current
 * and previous day quota values, quantities, and cash flow.
 *
 * The calculation accounts for the current day cash flow
 * and compares the resulting current day quota value against
 * the previous day quota value.
 *
 * The result is represented as a {@link GrowthFactor}.
 *
 * @param currentDayQuotaValue - The current day quota price.
 * @param currentDayQuotaQuantity - The current day quota quantity.
 * @param currentDayCashFlow - The current day net cash flow.
 * @param previousDayQuotaValue - The previous day quota price.
 * @param previousDayQuotaQuantity - The previous day quota quantity.
 *
 * @returns The calculated daily growth factor.
 *
 * @equation (Vₖᴾ - Δₖᴾ) / Vₖ₋₁ᴾ
 *
 * @example
 * ```ts
 * const RESULT = calculateDailyFactor({
 *   currentDayQuotaValue: QuotaPrice.create('4.424818'),
 *   currentDayQuotaQuantity: QuotaQuantity.create('342021.111191'),
 *   currentDayCashFlow: SignedMoney.create('0'),
 *   previousDayQuotaValue: QuotaPrice.create('4.423720'),
 *   previousDayQuotaQuantity: QuotaQuantity.create('342021.111191'),
 * })
 *
 * RESULT.value.toString()
 * // '1.00024821'
 * ```
 */
export function calculateDailyFactor({
  currentDayQuotaValue,
  currentDayQuotaQuantity,
  currentDayCashFlow,
  previousDayQuotaValue,
  previousDayQuotaQuantity,
}: CalculateDailyFactorProps): GrowthFactor {
  return GrowthFactor.create(
    currentDayQuotaValue.value
      .times(currentDayQuotaQuantity.value)
      .minus(currentDayCashFlow.value)
      .dividedBy(
        previousDayQuotaQuantity.value.times(previousDayQuotaValue.value),
      ),
  );
}
