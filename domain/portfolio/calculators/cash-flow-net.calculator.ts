import { SignedMoney, type PositiveMoney } from "@/value-objects"

interface CalculatePortfolioCashFlowNetProps {
  applications: PositiveMoney
  withdrawals: PositiveMoney
}

/**
 * @summary
 * Calculates the net cash flow for a Portfolio.
 *
 * @remarks
 * Subtracts total withdrawals from total applications.
 * Result can be positive, zero, or negative.
 *
 * @explanation
 * Use this function to determine the net capital movement
 * for a portfolio in a period. Aggregates across all
 * positions. Positive means net inflows, negative means net outflows.
 *
 * @param applications - Total application amount across positions.
 * @param withdrawals - Total withdrawal amount across positions.
 * @returns SignedMoney instance.
 *
 * @example
 * const RESULT = calculatePortfolioCashFlowNet({
 *   applications: PositiveMoney.create("5140000"),
 *   withdrawals: PositiveMoney.create("4000000"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculatePortfolioCashFlowNet({
  applications,
  withdrawals,
}: CalculatePortfolioCashFlowNetProps): SignedMoney {
  return SignedMoney.create(applications.value.minus(withdrawals.value))
}
