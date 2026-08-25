import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the total number of quotas held at the end of a period.
 *
 * The previous period's quota quantity, application quotas,
 * and withdrawal quotas are represented by {@link QuotaQuantity}.
 */
interface CalculateQuotasHeldProps {
  lastPeriodQuotaQuantity: QuotaQuantity;
  applicationQuotasQuantity: QuotaQuantity;
  withdrawalQuotasQuantity: QuotaQuantity;
}

/**
 * Calculates the number of quotas held at the end of a period
 * based on the previous period's quota quantity, applications,
 * and withdrawals.
 *
 * The result is represented as a {@link QuotaQuantity}.
 *
 * @param lastPeriodQuotaQuantity - The number of quotas held at the end of the previous period.
 * @param applicationQuotasQuantity - The number of quotas acquired through applications during the period.
 * @param withdrawalQuotasQuantity - The number of quotas redeemed through withdrawals during the period.
 *
 * @returns The calculated number of quotas held.
 *
 * @equation Qₜⁱ = Qₜ₋₁ⁱ + Qₜᴬ,ⁱ − Qₜᵂ,ⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculateQuotasHeld({
 *   lastPeriodQuotaQuantity: QuotaQuantity.create('342021.111191'),
 *   applicationQuotasQuantity: QuotaQuantity.create('225825.442804'),
 *   withdrawalQuotasQuantity: QuotaQuantity.create('224675.226343'),
 * })
 *
 * RESULT.value.toString()
 * // '343171.327652'
 * ```
 */
export function calculateQuotasHeld({
  lastPeriodQuotaQuantity,
  applicationQuotasQuantity,
  withdrawalQuotasQuantity,
}: CalculateQuotasHeldProps): QuotaQuantity {
  return QuotaQuantity.create(
    lastPeriodQuotaQuantity.value
      .plus(applicationQuotasQuantity.value)
      .minus(withdrawalQuotasQuantity.value),
  );
}
