/**
 * @summary
 * Defines the payload for creating a `Portfolio`.
 *
 * @remarks
 * Allocations obey min <= target <= max.
 * The annual interest rate must not be negative.
 * Percentages are decimal strings.
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
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
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
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}
