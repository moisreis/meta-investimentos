import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the total number of quotas withdrawn across all positions
 * in a portfolio.
 *
 * Each withdrawal quota quantity belongs to a position within
 * the portfolio and is represented by {@link QuotaQuantity}.
 */
interface CalculatePortfolioWithdrawalQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[];
}

/**
 * Calculates the total number of quotas withdrawn by summing
 * the withdrawal quota quantities from all positions within
 * the portfolio.
 *
 * Each withdrawal quota quantity represents the number of quotas
 * withdrawn from a position at time `t`. The result is the sum
 * of all withdrawal quotas across every position in the portfolio
 * at that time.
 *
 * The result is represented as a {@link QuotaQuantity}.
 *
 * @param quotaQuantity - The withdrawal quota quantities from
 *                        all positions in the portfolio to
 *                        be summed.
 *
 * @returns The total number of quotas withdrawn across all
 * positions in the portfolio.
 *
 * @equation Qₜᵂᴾ = ∑ᵢ Qₜᵂⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioWithdrawalQuotasSum({
 *   quotaQuantity: [
 *     { value: QuotaQuantity.create('225825.142804') },
 *     { value: QuotaQuantity.create('200000.000000') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '425825.142804'
 * ```
 */
export function calculatePortfolioWithdrawalQuotasSum({
  quotaQuantity,
}: CalculatePortfolioWithdrawalQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value,
  );

  return QuotaQuantity.create(SUM);
}
