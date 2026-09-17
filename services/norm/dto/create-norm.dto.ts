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
 *   categoryId: "category-1",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateNormDTO {
  articleNumber: string
  name: string
  categoryId: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}
