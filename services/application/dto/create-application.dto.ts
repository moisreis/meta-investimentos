import type { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating an `Application`.
 *
 * @remarks
 * Amount and quotas must be positive values.
 *
 * @explanation
 * Use this DTO to register an application through the
 * service layer.
 *
 * @example
 * const DTO: CreateApplicationDTO = {
 *   positionId: EntityId.create("position-1"),
 *   date: new Date("2026-01-01"),
 *   amount: PositiveMoney.create("10000"),
 *   quotas: QuotaQuantity.create("1000"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateApplicationDTO {
  positionId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
}
