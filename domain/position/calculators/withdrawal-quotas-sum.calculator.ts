import { QuotaQuantity } from "@/value-objects"

interface CalculateWithdrawalQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[]
}

/**
 * @summary
 * Calculates total withdrawal quotas from multiple entries.
 *
 * @remarks
 * Sums all quota quantities from withdrawals.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate the total quotas redeemed
 * through all withdrawals from a position during a period.
 *
 * @param quotaQuantity - Array of withdrawal quota quantities.
 *
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculateWithdrawalQuotasSum({
 *   quotaQuantity: [
 *     { value: QuotaQuantity.create("225825.442804") },
 *     { value: QuotaQuantity.create("100000.000000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateWithdrawalQuotasSum({
  quotaQuantity,
}: CalculateWithdrawalQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value
  )

  return QuotaQuantity.create(SUM)
}
