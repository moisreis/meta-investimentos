import { PositiveMoney } from "@/value-objects"

interface CalculatePortfolioApplicationSumProps {
  application: { value: PositiveMoney }[]
}

/**
 * @summary
 * Calculates total portfolio applications across all positions.
 *
 * @remarks
 * Sums application amounts from every position in portfolio.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate total capital applied
 * to a portfolio at period end. Each entry represents
 * one position's application amount.
 *
 * @param application - Array of position application amounts.
 *
 * @returns PositiveMoney instance.
 *
 * @example
 * const RESULT = calculatePortfolioApplicationSum({
 *   application: [
 *     { value: PositiveMoney.create("1000000") },
 *     { value: PositiveMoney.create("1100000") },
 *     { value: PositiveMoney.create("0") },
 *     { value: PositiveMoney.create("1000000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioApplicationSum({
  application,
}: CalculatePortfolioApplicationSumProps): PositiveMoney {
  const SUM = application.reduce(
    (acc, { value }) => acc.plus(value.value),
    PositiveMoney.create(0).value
  )

  return PositiveMoney.create(SUM)
}
