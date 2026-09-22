import { SignedMoney } from "@/value-objects"

interface CalculatePortfolioEarningsProps {
  sumOfPositionCurrentBalances: SignedMoney
  sumOfPositionInitialBalance: SignedMoney
  cashFlow: SignedMoney
}

/**
 * @summary
 * Calculates the earnings for a Portfolio in a period.
 *
 * @remarks
 * Subtracts aggregated initial balance and cash flow
 * from aggregated current balance.
 *
 * @explanation
 * Use this function to determine the profit or loss of a
 * portfolio over a period. It uses aggregated balances
 * across all positions and the portfolio's net cash flow.
 *
 * @param sumOfPositionCurrentBalances - Sum of all
 *   position current balances.
 * @param sumOfPositionInitialBalance - Sum of all
 *   position initial balances.
 * @param cashFlow - Portfolio net cash flow during period.
 *
 * @returns SignedMoney instance.
 *
 * @example
 * const RESULT = calculatePortfolioEarnings({
 *   sumOfPositionCurrentBalances:
 *     SignedMoney.create("7303437.91"),
 *   sumOfPositionInitialBalance:
 *     SignedMoney.create("6072272.64"),
 *   cashFlow: SignedMoney.create("1140000.00"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioEarnings({
  sumOfPositionCurrentBalances,
  sumOfPositionInitialBalance,
  cashFlow,
}: CalculatePortfolioEarningsProps): SignedMoney {
  return SignedMoney.create(
    sumOfPositionCurrentBalances.value
      .minus(sumOfPositionInitialBalance.value)
      .minus(cashFlow.value)
  )
}
