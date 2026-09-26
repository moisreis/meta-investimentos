import {
  type PositiveMoney,
  type QuotaPrice,
  QuotaQuantity,
} from "@/value-objects"
import { ValidationError } from "@/errors"

interface CalculateApplicationQuotasProps {
  application: PositiveMoney
  quota: QuotaPrice
}

/**
 * @summary
 * Calculates the number of quotas from an application amount.
 *
 * @remarks
 * Divides the application amount by the current quota price.
 * Result is normalized to 6 decimal places.
 *
 * @explanation
 * Use this function when a new application is made to determine
 * how many quotas the investor receives. It converts the
 * monetary amount into quota units using the current price.
 *
 * @param application - The monetary amount being invested.
 * @param quota - The current price of a single quota.
 *
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculateApplicationQuotas({
 *   application: PositiveMoney.create("1000000"),
 *   quota: QuotaPrice.create("4.428199"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateApplicationQuotas({
  application,
  quota,
}: CalculateApplicationQuotasProps): QuotaQuantity {
  if (quota.value.isZero()) {
    throw new ValidationError(
      "`Application` quotas cannot be calculated with a zero quota price."
    )
  }

  return QuotaQuantity.create(
    application.value.dividedBy(quota.value)
  )
}
