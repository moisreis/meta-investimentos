import PositiveMoney from "@/business/value-objects/positive-money.vo";

/**
 * Represents the inputs required to calculate
 * the total application amount from multiple applications.
 *
 * Each application amount is represented by {@link PositiveMoney}.
 */
interface CalculateApplicationSumProps {
  application: { value: PositiveMoney }[];
}

/**
 * Calculates the total application amount by summing
 * multiple application amounts.
 *
 * The result is represented as a {@link PositiveMoney}.
 *
 * @param application - The application amounts to be summed.
 *
 * @returns The total calculated application amount.
 *
 * @equation Aₜⁱ = ∑ₙ Aₜⁿ,ⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculateApplicationSum({
 *   application: [
 *     { value: PositiveMoney.create('1000000') },
 *     { value: PositiveMoney.create('500000') },
 *   ],
 * })
 *
 * RESULT.value.toString()
 * // '1500000'
 * ```
 */
export function calculateApplicationSum({
  application,
}: CalculateApplicationSumProps): PositiveMoney {
  const SUM = application.reduce(
    (acc, { value }) => acc.plus(value.value),
    PositiveMoney.create(0).value,
  );

  return PositiveMoney.create(SUM);
}
