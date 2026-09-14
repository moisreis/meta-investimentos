import { QuotaQuantity } from "@/value-objects";

interface CalculatePortfolioQuotasHeldSumProps {
  quotaQuantity: { value: QuotaQuantity }[];
}

/**
 * @summary
 * Calculates total portfolio quotas held across all positions.
 *
 * @remarks
 * Sums quota quantities held by every position in portfolio.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate the total quota balance
 * of a portfolio at period end. Each entry represents one
 * position's quota quantity.
 *
 * @param quotaQuantity - Array of position quota quantities held.
 * @returns QuotaQuantity instance.
 *
 * @example
 * const RESULT = calculatePortfolioQuotasHeldSum({
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
export function calculatePortfolioQuotasHeldSum({
  quotaQuantity,
}: CalculatePortfolioQuotasHeldSumProps): QuotaQuantity {
  const SUM = quotaQuantity.reduce(
    (acc, { value }) => acc.plus(value.value),
    QuotaQuantity.create(0).value,
  );

  return QuotaQuantity.create(SUM);
}
