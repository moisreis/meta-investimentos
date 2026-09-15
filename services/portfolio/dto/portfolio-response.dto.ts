import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the portfolio response.
 *
 * @remarks
 * This DTO is the format of the response for portfolio
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a portfolio to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(PORTFOLIO_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface PortfolioResponseDTO {
  id: EntityId
  acronym: string
  name: string
  userId: EntityId
  annualInterestRate: SignedPercentage
  minAllocation: SignedPercentage
  maxAllocation: SignedPercentage
  targetAllocation: SignedPercentage
  createdAt: Date
  updatedAt: Date
}
