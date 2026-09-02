import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/**
 * Represents the inputs required to calculate
 * the total number of quotas from multiple application
 * quota quantities.
 *
 * Each quota quantity is represented by {@link QuotaQuantity}.
 */
interface CalculatePortfolioApplicationQuotasSumProps {
  quotaQuantity: { value: QuotaQuantity }[];
}

/**
 * Calculates the total number of quotas by summing
 * multiple application quota quantities.
 *
 * The result is represented as a {@link QuotaQuantity}.
 *
 * @param quotaQuantity - The application quota quantities to be summed.
 *
 * @returns The total calculated number of application quotas.
 *
 * @equation Qₜᴬᴾ = ∑ᵢ Qₜᴬⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioApplicationQuotasSum({
 *   quotaQuantity: [
 *     { value: QuotaQuantity.create('225825.442804') },
 *     { value: QuotaQuantity.create('200000.000000') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '425825.442804'
 * ```
 */
export function calculatePortfolioApplicationQuotasSum({
  quotaQuantity,
}: CalculatePortfolioApplicationQuotasSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value,
  );

  return QuotaQuantity.create(SUM);
}
