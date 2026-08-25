import PositiveMoney from "@/business/value-objects/positive-money.vo";

/**
 * Represents the inputs required to calculate
 * the total withdrawal amount from multiple withdrawals.
 *
 * Each withdrawal amount is represented by {@link PositiveMoney}.
 */
interface CalculateWithdrawalSumProps {
  withdrawal: { value: PositiveMoney }[];
}

/**
 * Calculates the total withdrawal amount by summing
 * multiple withdrawal amounts.
 *
 * The result is represented as a {@link PositiveMoney}.
 *
 * @param withdrawal - The withdrawal amounts to be summed.
 *
 * @returns The total calculated withdrawal amount.
 *
 * @equation Wₜ = ∑ₙ Wₜ,ⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculateWithdrawalSum({
 *   withdrawal: [
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('500000') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '1500000'
 * ```
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
