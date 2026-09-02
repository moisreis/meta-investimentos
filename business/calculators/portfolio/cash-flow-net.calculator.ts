import type { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to calculate
 * the net cash flow of a portfolio from its total
 * applications and withdrawals.
 *
 * Both application and withdrawal amounts represent
 * the aggregated values across all positions in the portfolio
 * and are represented by {@link PositiveMoney}.
 */
interface CalculatePortfolioCashFlowNetProps {
  applications: PositiveMoney;
  withdrawals: PositiveMoney;
}

/**
 * Calculates the net cash flow of a portfolio by subtracting
 * the total withdrawal amount from the total application amount.
 *
 * The application and withdrawal amounts represent the sums
 * of all applications and withdrawals across every position
 * within the portfolio at time `t`.
 *
 * The result is represented as a {@link SignedMoney}, allowing
 * the portfolio's net cash flow to be positive, zero, or negative.
 *
 * @param applications - The total application amount across
 *                       all positions in the portfolio.
 * @param withdrawals - The total withdrawal amount across
 *                      all positions in the portfolio.
 *
 * @returns The calculated net cash flow of the portfolio.
 *
 * @equation Δₜᴾ = Aₜᴾ - Wₜᴾ
 *
 * @example
 * ```ts
 * const RESULT = calculatePortfolioCashFlowNet({
 *   applications: PositiveMoney.create('5140000'),
 *   withdrawals: PositiveMoney.create('4000000'),
 * })
 *
 * RESULT.value.toString()
 * // '1140000'
 * ```
 */
export function calculatePortfolioCashFlowNet({
  applications,
  withdrawals,
}: CalculatePortfolioCashFlowNetProps): SignedMoney {
  return SignedMoney.create(applications.value.minus(withdrawals.value));
}
