import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for updating a `Norm`.
 *
 * @remarks
 * Only the provided fields are changed. Allocation
 * ordering is re-validated on each change.
 *
 * @explanation
 * Use this DTO to update a regulatory norm through the
 * service layer.
 *
 * @example
 * const DTO: UpdateNormDTO = {
 *   name: "Novo Limite",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateNormDTO {
  articleNumber?: string
  name?: string
  categoryId?: EntityId
  minAllocation?: SignedPercentage
  maxAllocation?: SignedPercentage
  targetAllocation?: SignedPercentage
}
