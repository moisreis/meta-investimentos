import type { PositiveMoney } from "@/value-objects"

/**
 * @summary
 * Defines the payload for setting a `Position` initial balance.
 *
 * @remarks
 * Both the balance and its date are required to assign
 * the opening balance of an existing position.
 *
 * @explanation
 * Use this DTO to register the opening balance and date
 * of a persisted position.
 *
 * @example
 * const DTO: UpdatePositionDTO = {
 *   initialBalance: PositiveMoney.create("10000"),
 *   initialBalanceDate: new Date("2026-01-01"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdatePositionDTO {
  initialBalance: PositiveMoney
  initialBalanceDate: Date
}
