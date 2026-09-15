import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `Norm`.
 *
 * @remarks
 * Allocations obey min <= target <= max.
 *
 * @explanation
 * Use this DTO to create a regulatory norm through the
 * service layer.
 *
 * @example
 * const DTO: CreateNormDTO = {
 *   articleNumber: "Art. 12",
 *   name: "Limite de Concentração",
 *   categoryId: EntityId.create("category-1"),
 *   minAllocation: SignedPercentage.create("5"),
 *   maxAllocation: SignedPercentage.create("20"),
 *   targetAllocation: SignedPercentage.create("12"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateNormDTO {
  articleNumber: string
  name: string
  categoryId: EntityId
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
}
