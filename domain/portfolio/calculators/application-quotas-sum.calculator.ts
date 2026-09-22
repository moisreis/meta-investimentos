import { QuotaQuantity } from "@/value-objects"

interface CalculatePortfolioApplicationQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[]
}

/**
 * @summary
 * Calculates the portfolio's total application quotas.
 *
 * @remarks
 * Sums application quota quantities from every position.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate total quotas acquired
 * through applications in a portfolio at period end. Each
 * entry represents one position's application quota quantity.
 *
 * @param quotaQuantity - Application quotas per position.
 *
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculatePortfolioApplicationQuotasSum({
 *   quotaQuantity: [
 *     { value: QuotaQuantity.create("225825.442804") },
 *     { value: QuotaQuantity.create("200000.000000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioApplicationQuotasSum({
  quotaQuantity,
}: CalculatePortfolioApplicationQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value
  )

  return QuotaQuantity.create(SUM)
}
