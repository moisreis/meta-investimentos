import type { PortfolioNormAllocationDTO } from "./portfolio-norm-allocation.dto"

/**
 * @summary
 * Defines the payload for creating a `Portfolio`.
 *
 * @remarks
 * The annual interest rate must not be negative.
 * Percentages are decimal strings. The allocation of the
 * portfolio is not part of this payload: it belongs to the
 * norms attached to it, in `norms`.
 *
 * @explanation
 * Use this DTO to create a portfolio through the service
 * layer.
 *
 * @example
 * const DTO: CreatePortfolioDTO = {
 *   acronym: "MASTER",
 *   name: "Master Portfolio",
 *   userId: "user-1",
 *   annualInterestRate: "0",
 *   norms: [
 *     {
 *       normId: "norm-1",
 *       minAllocation: "5",
 *       targetAllocation: "10",
 *       maxAllocation: "15",
 *     },
 *   ],
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreatePortfolioDTO {
  acronym: string
  name: string
  userId: string
  annualInterestRate: string
  norms?: PortfolioNormAllocationDTO[]
}
