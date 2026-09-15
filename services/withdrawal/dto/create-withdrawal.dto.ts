import type { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `Withdrawal`.
 *
 * @remarks
 * Amount and quotas must be positive values.
 *
 * @explanation
 * Use this DTO to register a withdrawal through the
 * service layer.
 *
 * @example
 * const DTO: CreateWithdrawalDTO = {
 *   positionId: EntityId.create("position-1"),
 *   date: new Date("2026-01-01"),
 *   amount: PositiveMoney.create("5000"),
 *   quotas: QuotaQuantity.create("500"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateWithdrawalDTO {
  positionId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
}
