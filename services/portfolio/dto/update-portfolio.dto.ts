import type { PortfolioNormAllocationDTO } from "./portfolio-norm-allocation.dto"

/**
 * @summary
 * Defines the payload for updating a `Portfolio`.
 *
 * @remarks
 * Only the provided fields change. Percentages are decimal
 * strings. A missing `norms` leaves the norm-portfolio
 * relations of the portfolio untouched.
 *
 * @explanation
 * Use this DTO to adjust the portfolio identity, its
 * allocation or its annual interest rate.
 *
 * @example
 * const DTO: UpdatePortfolioDTO = {
 *   name: "Renda Fixa IPCA",
 *   targetAllocation: "15",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdatePortfolioDTO {
  acronym?: string
  name?: string
  annualInterestRate?: string
  minAllocation?: string
  maxAllocation?: string
  targetAllocation?: string
  norms?: PortfolioNormAllocationDTO[]
}
