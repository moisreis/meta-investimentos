import { QuotaQuantity } from "@/value-objects"

interface CalculateQuotasHeldProps {
  lastPeriodQuotaQuantity: QuotaQuantity
  applicationQuotasQuantity: QuotaQuantity
  withdrawalQuotasQuantity: QuotaQuantity
}

/**
 * @summary
 * Calculates the total quotas held at end of period.
 *
 * @remarks
 * Adds previous quotas and applications, subtracts withdrawals.
 * Result is a valid QuotaQuantity.
 *
 * @explanation
 * Use this function at period close to compute the updated
 * quota balance for a position. It accounts for all changes
 * during the period: new applications and withdrawals.
 *
 * @param lastPeriodQuotaQuantity - Quotas held at
 *   previous period end.
 * @param applicationQuotasQuantity - Quotas acquired
 *   via applications.
 * @param withdrawalQuotasQuantity - Quotas redeemed
 *   via withdrawals.
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculateQuotasHeld({
 *   lastPeriodQuotaQuantity:
 *     QuotaQuantity.create("342021.111191"),
 *   applicationQuotasQuantity:
 *     QuotaQuantity.create("225825.442804"),
 *   withdrawalQuotasQuantity:
 *     QuotaQuantity.create("224675.226343"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateQuotasHeld({
  lastPeriodQuotaQuantity,
  applicationQuotasQuantity,
  withdrawalQuotasQuantity,
}: CalculateQuotasHeldProps): QuotaQuantity {
  return QuotaQuantity.create(
    lastPeriodQuotaQuantity.value
      .plus(applicationQuotasQuantity.value)
      .minus(withdrawalQuotasQuantity.value)
  )
}
