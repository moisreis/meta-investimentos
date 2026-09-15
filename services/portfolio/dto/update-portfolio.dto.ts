import type { SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for updating a `Portfolio`.
 *
 * @remarks
 * Only the provided rate and allocation fields change.
 *
 * @explanation
 * Use this DTO to adjust a portfolio allocation or its
 * annual interest rate.
 *
 * @example
 * const DTO: UpdatePortfolioDTO = {
 *   targetAllocation: SignedPercentage.create("15"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdatePortfolioDTO {
  annualInterestRate?: SignedPercentage
  minAllocation?: SignedPercentage
  maxAllocation?: SignedPercentage
  targetAllocation?: SignedPercentage
}
