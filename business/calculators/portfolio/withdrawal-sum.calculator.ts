import PositiveMoney from "@/business/value-objects/positive-money.vo";

/**
 * Represents the inputs required to calculate
 * the total withdrawal amount across all positions
 * in a portfolio.
 *
 * Each withdrawal amount belongs to a position within
 * the portfolio and is represented by {@link PositiveMoney}.
 */
interface CalculatePortfolioWithdrawalSumProps {
  withdrawal: { value: PositiveMoney }[];
}

/**
 * Calculates the total withdrawal amount for a portfolio
 * by summing the withdrawal amounts from all positions
 * within the portfolio.
 *
 * Each withdrawal represents the amount withdrawn from a position
 * at time `t`. The result is the sum of all withdrawals across
 * every position in the portfolio at that time.
 *
 * The result is represented as a {@link PositiveMoney}.
 *
 * @param withdrawal - The withdrawal amounts from all positions
 * in the portfolio to be summed.
 *
 * @returns The total withdrawal amount across all positions
 * in the portfolio.
 *
 * @equation Wₜᴾ = ∑ᵢ Wₜⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioWithdrawalSum({
 *   withdrawal: [
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('0') },
 *     { value: PositiveMoney.create('500000') },
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('500000') },
 *     { value: PositiveMoney.create('0') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '4000000'
 * ```
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
