/**
 * @summary
 * Defines the payload for setting a `Position` initial balance.
 *
 * @remarks
 * Both the balance and its date are required to assign
 * the opening balance of an existing position. The
 * balance is a decimal string; the date is ISO 8601.
 *
 * @explanation
 * Use this DTO to register the opening balance and date
 * of a persisted position.
 *
 * @example
 * const DTO: UpdatePositionDTO = {
 *   initialBalance: "10000",
 *   initialBalanceDate: "2026-01-01T00:00:00.000Z",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdatePositionDTO {
  initialBalance: string
  initialBalanceDate: string
}
