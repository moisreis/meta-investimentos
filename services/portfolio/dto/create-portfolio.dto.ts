import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `Portfolio`.
 *
 * @remarks
 * Allocations obey min <= target <= max.
 * The annual interest rate must not be negative.
 *
 * @explanation
 * Use this DTO to create a portfolio through the service
 * layer.
 *
 * @example
 * const DTO: CreatePortfolioDTO = {
 *   acronym: "MASTER",
 *   name: "Master Portfolio",
 *   userId: EntityId.create("user-1"),
 *   annualInterestRate: SignedPercentage.create("0"),
 *   minAllocation: SignedPercentage.create("5"),
 *   maxAllocation: SignedPercentage.create("20"),
 *   targetAllocation: SignedPercentage.create("12"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreatePortfolioDTO {
  acronym: string
  name: string
  userId: EntityId
  annualInterestRate: SignedPercentage
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
}
