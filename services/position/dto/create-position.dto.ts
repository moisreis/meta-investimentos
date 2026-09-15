import type { EntityId, PositiveMoney } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `Position`.
 *
 * @remarks
 * The initial balance defaults to null when omitted.
 *
 * @explanation
 * Use this DTO to create a position through the service
 * layer.
 *
 * @example
 * const DTO: CreatePositionDTO = {
 *   portfolioId: EntityId.create("portfolio-1"),
 *   fundId: EntityId.create("fund-1"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreatePositionDTO {
  portfolioId: EntityId
  fundId: EntityId
  initialBalance?: PositiveMoney | null
  initialBalanceDate?: Date | null
}
