import type { EntityId, PositiveMoney } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the position response.
 *
 * @remarks
 * This DTO is the format of the response for position
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a position to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(POSITION_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface PositionResponseDTO {
  id: EntityId
  portfolioId: EntityId
  fundId: EntityId
  initialBalance: PositiveMoney | null
  initialBalanceDate: Date | null
  // Optimistic lock version, incremented on updates.
  version: number
  createdAt: Date
  updatedAt: Date
}
