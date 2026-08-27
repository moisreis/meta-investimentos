import type PositiveMoney from "@/business/value-objects/positive-money.vo";
import type QuotaPrice from "@/business/value-objects/quota-price.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the number of quotas corresponding to a withdrawal.
 *
 * The withdrawal amount is represented by {@link PositiveMoney},
 * while the quota price is represented by {@link QuotaPrice}.
 */
interface CalculateWithdrawalQuotasProps {
  withdrawal: PositiveMoney;
  quota: QuotaPrice;
}

/**
 * Calculates the number of quotas corresponding to
 * a withdrawal amount based on the current quota price.
 *
 * The result is represented as a {@link QuotaQuantity}
 * and is normalized to a maximum of 6 decimal places.
 *
 * @param withdrawal - The monetary amount being withdrawn.
 * @param quota - The current price of a single quota.
 *
 * @returns The calculated number of quotas.
 *
 * @equation Qₜᵂˢ = Wₜⁿ / Qₜ
 *
 * @example
 * ```ts
 * const RESULT = calculateWithdrawalQuotas({
 *   withdrawal: PositiveMoney.create('1000000'),
 *   quota: QuotaPrice.create('4.450869'),
 * })
 *
 * RESULT.value.toString()
 * // '224675.226343'
 * ```
 */
export function calculateWithdrawalQuotas({
  withdrawal,
  quota,
}: CalculateWithdrawalQuotasProps): QuotaQuantity {
  return QuotaQuantity.create(withdrawal.value.dividedBy(quota.value));
}
