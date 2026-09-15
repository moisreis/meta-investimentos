import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a norm-portfolio relation.
 *
 * @remarks
 * Allocations obey min <= target <= max.
 *
 * @explanation
 * Use this DTO to link a regulatory norm to a portfolio
 * with specific allocation limits.
 *
 * @example
 * const DTO: CreateNormPortfolioDTO = {
 *   normId: EntityId.create("norm-1"),
 *   portfolioId: EntityId.create("portfolio-1"),
 *   minAllocation: SignedPercentage.create("5"),
 *   maxAllocation: SignedPercentage.create("20"),
 *   targetAllocation: SignedPercentage.create("12"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateNormPortfolioDTO {
  normId: EntityId
  portfolioId: EntityId
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
}
