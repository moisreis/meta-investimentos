/**
 * @summary
 * Defines the payload for creating a `Position`.
 *
 * @remarks
 * The initial balance defaults to null when omitted.
 * The balance is a decimal string; the date is ISO 8601.
 * The allocation is a percentage string and defaults
 * to the full share of the portfolio.
 *
 * @explanation
 * Use this DTO to create a position through the service
 * layer.
 *
 * @example
 * const DTO: CreatePositionDTO = {
 *   portfolioId: "portfolio-1",
 *   fundId: "fund-1",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreatePositionDTO {
  portfolioId: string
  fundId: string
  initialBalance?: string | null
  initialBalanceDate?: string | null
  allocation?: string
}
