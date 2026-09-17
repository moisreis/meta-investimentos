import { PositiveMoney } from "@/value-objects"

interface CalculateApplicationSumProps {
  application: { value: PositiveMoney }[]
}

/**
 * @summary
 * Calculates the total application amount from multiple entries.
 *
 * @remarks
 * Sums all application amounts in the array.
 * Returns zero if array is empty.
 *
 * @explanation
 * Use this function to aggregate all applications made to a
 * position during a period. Each entry represents one application.
 *
 * @param application - Array of application amounts.
 * @returns PositiveMoney instance.
 *
 * @example
 * const RESULT = calculateApplicationSum({
 *   application: [
 *     { value: PositiveMoney.create("1000000") },
 *     { value: PositiveMoney.create("500000") },
 *   ],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateApplicationSum({
  application,
}: CalculateApplicationSumProps): PositiveMoney {
  const SUM = application.reduce(
    (acc, { value }) => acc.plus(value.value),
    PositiveMoney.create(0).value
  )

  return PositiveMoney.create(SUM)
}
