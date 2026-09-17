import { QuotaQuantity } from "@/value-objects"

interface CalculateApplicationQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[]
}

/**
 * @summary
 * Calculates total application quotas from multiple entries.
 *
 * @remarks
 * Sums all quota quantities from applications.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate the total quotas acquired
 * through all applications to a position during a period.
 *
 * @param quotaQuantity - Array of application quota quantities.
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculateApplicationQuotasSum({
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
export function calculateApplicationQuotasSum({
  quotaQuantity,
}: CalculateApplicationQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value
  )

  return QuotaQuantity.create(SUM)
}
