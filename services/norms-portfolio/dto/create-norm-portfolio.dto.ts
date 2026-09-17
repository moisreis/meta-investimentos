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
 *   normId: "norm-1",
 *   portfolioId: "portfolio-1",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateNormPortfolioDTO {
  normId: string
  portfolioId: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}
