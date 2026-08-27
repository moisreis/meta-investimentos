import SignedMoney from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to calculate
 * the earnings of a portfolio for a period.
 *
 * The current balances and initial balances represent
 * the aggregated balances across all positions in the portfolio.
 *
 * All monetary values are represented by {@link SignedMoney}.
 */
interface CalculatePortfolioEarningsProps {
  sumOfPositionCurrentBalances: SignedMoney;
  sumOfPositionInitialBalance: SignedMoney;
  cashFlow: SignedMoney;
}

/**
 * Calculates the earnings of a portfolio for a period by
 * subtracting the aggregated initial balance and net cash flow
 * from the aggregated current balance.
 *
 * The current balance and initial balance are the sums of the
 * corresponding balances across all positions within the portfolio.
 *
 * The result is represented as a {@link SignedMoney}, allowing
 * portfolio earnings to be positive, zero, or negative.
 *
 * @param sumOfPositionCurrentBalances - The sum of the current
 * balances of all positions in the portfolio.
 * @param sumOfPositionInitialBalance - The sum of the initial
 * balances of all positions in the portfolio.
 * @param cashFlow - The net cash flow of the portfolio during
 * the period.
 *
 * @returns The calculated portfolio earnings.
 *
 * @equation Eₜᴾ = Vₜᴾ − IB₀ᴾ − Δₜᴾ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioEarnings({
 *   sumOfPositionCurrentBalances: SignedMoney.create('7303437.91'),
 *   sumOfPositionInitialBalance: SignedMoney.create('6072272.64'),
 *   cashFlow: SignedMoney.create('1140000.00'),
 * })
 *
 * RESULT.value.toString()
 * // '91165.27'
 * ```
 */
export function calculatePortfolioEarnings({
  sumOfPositionCurrentBalances,
  sumOfPositionInitialBalance,
  cashFlow,
}: CalculatePortfolioEarningsProps): SignedMoney {
  return SignedMoney.create(
    sumOfPositionCurrentBalances.value
      .minus(sumOfPositionInitialBalance.value)
      .minus(cashFlow.value),
  );
}
