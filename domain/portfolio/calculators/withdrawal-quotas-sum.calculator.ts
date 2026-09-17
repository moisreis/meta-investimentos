import { QuotaQuantity } from "@/value-objects"

interface CalculatePortfolioWithdrawalQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[]
}

/**
 * @summary
 * Calculates total portfolio withdrawal quotas across positions.
 *
 * @remarks
 * Sums withdrawal quota quantities from every position.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate total quotas redeemed
 * from a portfolio at period end. Each entry represents
 * one position's withdrawal quota quantity.
 *
 * @param quotaQuantity - Array of position withdrawal quota quantities.
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculatePortfolioWithdrawalQuotasSum({
 *   quotaQuantity: [
 *     { value: QuotaQuantity.create("225825.142804") },
 *     { value: QuotaQuantity.create("200000.000000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioWithdrawalQuotasSum({
  quotaQuantity,
}: CalculatePortfolioWithdrawalQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value
  )

  return QuotaQuantity.create(SUM)
}
