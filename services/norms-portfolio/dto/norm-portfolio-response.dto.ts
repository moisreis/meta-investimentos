import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the norm-portfolio response.
 *
 * @remarks
 * This DTO is the format of the response for
 * norm-portfolio queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a norm-portfolio relation
 * to the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(NORM_RELATION_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface NormPortfolioResponseDTO {
  id: EntityId
  normId: EntityId
  portfolioId: EntityId
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  createdAt: Date
}
