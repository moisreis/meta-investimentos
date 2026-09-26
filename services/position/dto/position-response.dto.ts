/**
 * @summary
 * Represents the shape of the position response.
 *
 * @remarks
 * This DTO is the format of the response for position
 * queries and mutations. Ids are strings, amounts are
 * decimal strings, and dates are ISO 8601.
 *
 * @explanation
 * Use this DTO when exposing a position to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(POSITION_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface PositionResponseDTO {
  id: string
  portfolioId: string
  fundId: string
  initialBalance: string | null
  initialBalanceDate: string | null
  // Share of the portfolio the position represents (%).
  allocation: string
  // Optimistic lock version, incremented on updates.
  version: number
  createdAt: string
  updatedAt: string
}
