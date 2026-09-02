import type { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the inputs required to calculate
 * the number of quotas corresponding to an application.
 *
 * The application amount is represented by {@link PositiveMoney},
 * while the quota price is represented by {@link QuotaPrice}.
 */
interface CalculateApplicationQuotasProps {
  application: PositiveMoney;
  quota: QuotaPrice;
}

/**
 * Calculates the number of quotas corresponding to
 * an application amount based on the current quota price.
 *
 * The result is represented as a {@link QuotaQuantity}
 * and is normalized to a maximum of 6 decimal places.
 *
 * @param application - The monetary amount being invested.
 * @param quota - The current price of a single quota.
 *
 * @returns The calculated number of quotas.
 *
 * @throws {ValidationError} If `quota` is zero.
 *
 * @equation Qₜᴬ˒ⁱ = Aₜⁿ˒ⁱ / Qₜ
 *
 * @example
 * ```ts
 * const RESULT = calculateApplicationQuotas({
 *   application: PositiveMoney.create('1000000'),
 *   quota: QuotaPrice.create('4.428199'),
 * })
 *
 * RESULT.value.toString()
 * // '225825.442804'
 * ```
 */
export function calculateApplicationQuotas({
  application,
  quota,
}: CalculateApplicationQuotasProps): QuotaQuantity {
  if (quota.value.isZero()) {
    throw new ValidationError(
      "Application quotas cannot be calculated with a zero quota price.",
    );
  }

  return QuotaQuantity.create(application.value.dividedBy(quota.value));
}
