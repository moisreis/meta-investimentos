/**
 * @summary
 * Defines the payload for creating a `Withdrawal`.
 *
 * @remarks
 * Amount and quotas are decimal strings; date is ISO
 * 8601. Value objects are built in the service mapper.
 *
 * @explanation
 * Use this DTO to register a withdrawal through the
 * service layer.
 *
 * @example
 * const DTO: CreateWithdrawalDTO = {
 *   positionId: "position-1",
 *   date: "2026-01-01T00:00:00.000Z",
 *   amount: "5000",
 *   quotas: "500",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateWithdrawalDTO {
  positionId: string
  date: string
  amount: string
  quotas: string
}
