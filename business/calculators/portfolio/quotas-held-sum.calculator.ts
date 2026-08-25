import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the total number of quotas held across all positions
 * in a portfolio.
 *
 * Each quota quantity belongs to a position within
 * the portfolio and is represented by {@link QuotaQuantity}.
 */
interface CalculatePortfolioQuotasHeldSumProps {
  quotaQuantity: { value: QuotaQuantity }[];
}

/**
 * Calculates the total number of quotas held by a portfolio
 * by summing the quota quantities held by all positions
 * within the portfolio.
 *
 * Each quota quantity represents the number of quotas held
 * by a position at time `t`. The result is the sum of the
 * quotas held across every position in the portfolio at that time.
 *
 * The result is represented as a {@link QuotaQuantity}.
 *
 * @param quotaQuantity - The quota quantities held by all positions
 * in the portfolio to be summed.
 *
 * @returns The total number of quotas held across all positions
 * in the portfolio.
 *
 * @equation Qₜᴾ = ∑ᵢ Qₜⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioQuotasHeldSum({
 *   quotaQuantity: [
 *     { value: QuotaQuantity.create('225825.442804') },
 *     { value: QuotaQuantity.create('100000.000000') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '325825.442804'
 * ```
 */
export function calculatePortfolioQuotasHeldSum({
  quotaQuantity,
}: CalculatePortfolioQuotasHeldSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value,
  );

  return QuotaQuantity.create(SUM);
}
