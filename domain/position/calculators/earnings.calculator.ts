import { SignedMoney } from "@/value-objects"

interface CalculateEarningsProps {
  currentBalance: SignedMoney
  initialBalance: SignedMoney
  cashFlow: SignedMoney
}

/**
 * @summary
 * Calculates the earnings for a position in a period.
 *
 * @remarks
 * Subtracts initial balance and cash flow from current balance.
 * Result can be positive, zero, or negative.
 *
 * @explanation
 * Use this function to determine the profit or loss of a
 * position over a period. It isolates earnings by removing
 * the effect of external cash flows.
 *
 * @param currentBalance - Balance at period end.
 * @param initialBalance - Balance at period start.
 * @param cashFlow - Net cash flow during period.
 *
 * @returns SignedMoney instance.
 *
 * @example
 * const RESULT = calculateEarnings({
 *   currentBalance: SignedMoney.create("1534123.40"),
 *   initialBalance: SignedMoney.create("1513005.63"),
 *   cashFlow: SignedMoney.create("0.00"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateEarnings({
  currentBalance,
  initialBalance,
  cashFlow,
}: CalculateEarningsProps): SignedMoney {
  return SignedMoney.create(
    currentBalance.value
      .minus(initialBalance.value)
      .minus(cashFlow.value)
  )
}
