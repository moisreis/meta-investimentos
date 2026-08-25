import PositiveMoney from "@/business/value-objects/positive-money.vo";

/**
 * Represents the inputs required to calculate
 * the total application amount across all positions
 * in a portfolio.
 *
 * Each application amount belongs to a position within
 * the portfolio and is represented by {@link PositiveMoney}.
 */
interface CalculatePortfolioApplicationSumProps {
  application: { value: PositiveMoney }[];
}

/**
 * Calculates the total application amount for a portfolio
 * by summing the application amounts from all positions
 * within the portfolio.
 *
 * Each application represents the amount applied to a position
 * at time `t`. The result is the sum of all applications across
 * every position in the portfolio at that time.
 *
 * The result is represented as a {@link PositiveMoney}.
 *
 * @param application - The application amounts from all positions
 * in the portfolio to be summed.
 *
 * @returns The total application amount across all positions
 * in the portfolio.
 *
 * @equation Aₜᴾ = ∑ᵢ Aₜⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioApplicationSum({
 *   application: [
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('1100000') },
 *     { value: PositiveMoney.create('0') },
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('40000') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '5140000'
 * ```
 */
export function calculatePortfolioApplicationSum({
  application,
}: CalculatePortfolioApplicationSumProps): PositiveMoney {
  const SUM = application.reduce(
    (acc, { value }) => acc.plus(value.value),
    PositiveMoney.create(0).value,
  );

  return PositiveMoney.create(SUM);
}
