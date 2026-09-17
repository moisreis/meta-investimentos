/**
 * @summary
 * Defines the payload for updating a norm-portfolio relation.
 *
 * @remarks
 * Only the provided allocation fields are changed.
 *
 * @explanation
 * Use this DTO to adjust the allocation limits of an
 * existing norm-portfolio relation.
 *
 * @example
 * const DTO: UpdateNormPortfolioDTO = {
 *   targetAllocation: "15",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateNormPortfolioDTO {
  minAllocation?: string
  maxAllocation?: string
  targetAllocation?: string
}
