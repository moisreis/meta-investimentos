import { PositiveMoney } from "@/value-objects";

interface CalculateWithdrawalSumProps {
  withdrawal: { value: PositiveMoney }[];
}

/**
 * @summary
 * Calculates the total withdrawal amount from multiple entries.
 *
 * @remarks
 * Sums all withdrawal amounts in the array.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate all withdrawals made from a
 * position during a period. Each entry represents one withdrawal.
 *
 * @param withdrawal - Array of withdrawal amounts.
 * @returns PositiveMoney instance.
 *
 * @example
 * const RESULT = calculateWithdrawalSum({
 *   withdrawal: [
 *     { value: PositiveMoney.create("1000000") },
 *     { value: PositiveMoney.create("500000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateWithdrawalSum({
  withdrawal,
}: CalculateWithdrawalSumProps): PositiveMoney {
  const SUM = withdrawal.reduce(
    (acc, { value }) => acc.plus(value.value),
    PositiveMoney.create(0).value,
  );

  return PositiveMoney.create(SUM);
}
