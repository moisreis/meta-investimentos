import SignedMoney from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to calculate
 * the earnings for a period.
 *
 * The current balance, initial balance, and net cash flow
 * are represented by {@link SignedMoney}.
 */
interface CalculateEarningsProps {
  currentBalance: SignedMoney;
  initialBalance: SignedMoney;
  cashFlow: SignedMoney;
}

/**
 * Calculates the earnings for a period by subtracting
 * the initial balance and net cash flow from the current balance.
 *
 * The result is represented as a {@link SignedMoney}, allowing
 * earnings to be positive, zero, or negative.
 *
 * @param currentBalance - The balance at the end of the period.
 * @param initialBalance - The balance at the beginning of the period.
 * @param cashFlow - The net cash flow during the period.
 *
 * @returns The calculated earnings.
 *
 * @equation Eₜⁱ = Vₜⁱ − IB₀ⁱ − Δₜⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculateEarnings({
 *   currentBalance: SignedMoney.create('1534123.40'),
 *   initialBalance: SignedMoney.create('1513005.63'),
 *   cashFlow: SignedMoney.create('0.00'),
 * })
 *
 * RESULT.value.toString()
 * // '21117.77'
 * ```
 */
export function calculateEarnings({
  currentBalance,
  initialBalance,
  cashFlow,
}: CalculateEarningsProps): SignedMoney {
  return SignedMoney.create(
    currentBalance.value.minus(initialBalance.value).minus(cashFlow.value),
  );
}
