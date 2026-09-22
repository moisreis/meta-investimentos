import {
  type PositiveMoney,
  type QuotaPrice,
  QuotaQuantity,
} from "@/value-objects"
import { ValidationError } from "@/errors"

interface CalculateWithdrawalQuotasProps {
  withdrawal: PositiveMoney
  quota: QuotaPrice
}

/**
 * @summary
 * Calculates the quotas for a withdrawal amount.
 *
 * @remarks
 * Divides the withdrawal amount by the current quota price.
 * Throws `ValidationError` when the quota price is zero.
 * The result is normalized to at most 6 decimal places.
 *
 * @explanation
 * Use this function when a withdrawal is made to determine
 * how many quotas the investor redeems. It converts the
 * monetary amount into quota units using the current price.
 *
 * @param withdrawal - The monetary amount being withdrawn.
 * @param quota - The current price of a single quota.
 *
 * @returns Withdrawn quota count.
 *
 * @example
 * const RESULT = calculateWithdrawalQuotas({
 *   withdrawal: PositiveMoney.create("1000000"),
 *   quota: QuotaPrice.create("4.450869"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function calculateWithdrawalQuotas({
  withdrawal,
  quota,
}: CalculateWithdrawalQuotasProps): QuotaQuantity {
  if (quota.value.isZero()) {
    throw new ValidationError(
      "`Withdrawal` quotas cannot be calculated with a zero quota price."
    )
  }

  return QuotaQuantity.create(withdrawal.value.dividedBy(quota.value))
}
