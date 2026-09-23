/**
 * @summary
 * Represents the shape of the portfolio response.
 *
 * @remarks
 * This DTO is the format of the response for portfolio
 * queries and mutations. Ids are strings, dates are ISO
 * 8601, percentages are decimal strings, and `ownerName`
 * carries the display name of the owning user.
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
  id: string
  acronym: string
  name: string
  userId: string
  ownerName: string
  annualInterestRate: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
  createdAt: string
  updatedAt: string
}
