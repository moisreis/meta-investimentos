import { SignedMoney, type PositiveMoney } from "@/value-objects"

interface CalculateCashFlowNetProps {
  applications: PositiveMoney
  withdrawals: PositiveMoney
}

/**
 * @summary
 * Calculates the net cash flow for a position.
 *
 * @remarks
 * Subtracts total withdrawals from total applications.
 * Result can be positive, zero, or negative.
 *
 * @explanation
 * Use this function to determine the net capital movement
 * for a position in a period. Positive means net inflows,
 * negative means net outflows.
 *
 * @param applications - Total application amount.
 * @param withdrawals - Total withdrawal amount.
 *
 * @returns SignedMoney instance.
 *
 * @example
 * const RESULT = calculateCashFlowNet({
 *   applications: PositiveMoney.create("1000000"),
 *   withdrawals: PositiveMoney.create("250000"),
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export function calculateCashFlowNet({
  applications,
  withdrawals,
}: CalculateCashFlowNetProps): SignedMoney {
  return SignedMoney.create(applications.value.minus(withdrawals.value))
}
