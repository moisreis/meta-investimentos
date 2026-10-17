import Decimal from "decimal.js"

interface CalculateAmountSumProps {
  // Amounts to sum, as decimal strings.
  values: readonly string[]
}

/**
 * @summary
 * Sums a series of amounts into one total.
 *
 * @remarks
 * Adds every value in order and returns the total with two
 * decimals. An empty series sums to `0.00`, so an absent
 * month never resolves to a missing figure. Negative values
 * are honoured, so a redemption-heavy run can carry the
 * total below zero.
 *
 * @explanation
 * Use this calculator to aggregate the amount columns of the
 * statement report: the earnings of a run of months, the
 * applications and the withdrawals of a position, or the
 * balances of the checking accounts. It only adds what the
 * caller provides, so the grouping stays outside.
 *
 * @param props - The amounts to sum.
 *
 * @returns The total, in the unit of the inputs.
 *
 * @example
 * const TOTAL = calculateAmountSum({
 *   values: ["10.00", "-2.50", "0.50"],
 * }); // "8.00"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-15
 */
export function calculateAmountSum({
  values,
}: CalculateAmountSumProps): string {
  return values
    .reduce(
      (sum, value) => sum.plus(new Decimal(value)),
      new Decimal(0)
    )
    .toFixed(2)
}
