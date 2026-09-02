import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the total number of quotas from multiple quota quantities.
 *
 * Each quota quantity is represented by {@link QuotaQuantity}.
 */
interface CalculateApplicationQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[];
}

/**
 * Calculates the total number of quotas by summing
 * multiple quota quantities.
 *
 * The result is represented as a {@link QuotaQuantity}.
 *
 * @param quotaQuantity - The quota quantities to be summed.
 *
 * @returns The total calculated number of quotas.
 *
 * @equation Qₜᴬ,ⁱ = ∑ₙ (Aₜⁿ,ⁱ / Qₜ)
 *
 * @example
 * ```ts
 * const RESULT = calculateApplicationQuotasSum({
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
export function calculateApplicationQuotasSum({
  quotaQuantity,
}: CalculateApplicationQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value,
  );

  return QuotaQuantity.create(SUM);
}
