import type { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

/**
 * Represents the inputs required to calculate
 * the net cash flow from applications and withdrawals.
 *
 * Both application and withdrawal amounts are represented
 * by {@link PositiveMoney}.
 */
interface CalculateCashFlowNetProps {
  applications: PositiveMoney;
  withdrawals: PositiveMoney;
}

/**
 * Calculates the net cash flow by subtracting the total
 * withdrawal amount from the total application amount.
 *
 * The result is represented as a {@link SignedMoney}, allowing
 * the net cash flow to be positive, zero, or negative.
 *
 * @param applications - The total amount of applications.
 * @param withdrawals - The total amount of withdrawals.
 *
 * @returns The calculated net cash flow.
 *
 * @equation Δₜⁱ = Aₜⁱ − Wₜⁱ
 *
 * @example
 * ```ts
 * const RESULT = calculateCashFlowNet({
 *   applications: PositiveMoney.create('1000000'),
 *   withdrawals: PositiveMoney.create('250000'),
 * })
 *
 * RESULT.value.toString()
 * // '750000'
 * ```
 */
export function calculateCashFlowNet({
  applications,
  withdrawals,
}: CalculateCashFlowNetProps): SignedMoney {
  return SignedMoney.create(applications.value.minus(withdrawals.value));
}
