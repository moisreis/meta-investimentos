import { PositiveMoney } from "@/value-objects";

interface CalculatePortfolioWithdrawalSumProps {
  withdrawal: { value: PositiveMoney }[];
}

/**
 * @summary
 * Calculates total portfolio withdrawals across all positions.
 *
 * @remarks
 * Sums withdrawal amounts from every position in portfolio.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate total capital withdrawn
 * from a portfolio at period end. Each entry represents
 * one position's withdrawal amount.
 *
 * @param withdrawal - Array of position withdrawal amounts.
 * @returns PositiveMoney instance.
 *
 * @example
 * const RESULT = calculatePortfolioWithdrawalSum({
 *   withdrawal: [
 *     { value: PositiveMoney.create("1000000") },
 *     { value: PositiveMoney.create("1000000") },
 *     { value: PositiveMoney.create("0") },
 *     { value: PositiveMoney.create("500000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioWithdrawalSum({
  withdrawal,
}: CalculatePortfolioWithdrawalSumProps): PositiveMoney {
  const SUM = withdrawal.reduce(
    (acc, { value }) => acc.plus(value.value),
    PositiveMoney.create(0).value,
  );

  return PositiveMoney.create(SUM);
}
