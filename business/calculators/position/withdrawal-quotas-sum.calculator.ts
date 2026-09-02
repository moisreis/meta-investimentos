import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the total number of quotas from multiple withdrawal quota quantities.
 *
 * Each quota quantity is represented by {@link QuotaQuantity}.
 */
interface CalculateWithdrawalQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[];
}

/**
 * Calculates the total number of quotas by summing
 * multiple withdrawal quota quantities.
 *
 * The result is represented as a {@link QuotaQuantity}.
 *
 * @param quotaQuantity - The withdrawal quota quantities to be summed.
 *
 * @returns The total calculated number of withdrawal quotas.
 *
 * @equation Qₜᵂ,ⁱ = ∑ₙ (Wₜⁿ,ⁱ / Qₜ)
 *
 * @example
 * ```ts
 * const RESULT = calculateWithdrawalQuotasSum({
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
export function calculateWithdrawalQuotasSum({
  quotaQuantity,
}: CalculateWithdrawalQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value,
  );

  return QuotaQuantity.create(SUM);
}
