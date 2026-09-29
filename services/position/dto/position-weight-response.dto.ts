/**
 * @summary
 * Represents the share a position holds of its portfolio,
 * and the money it is built from.
 *
 * @remarks
 * This DTO is the format of the response for position
 * weight queries. Ids are strings, the weight is a decimal
 * string in percent units and the invested value is a
 * decimal money string, so the presenters are the only
 * place that formats them.
 *
 * The invested value is signed, because redeeming a
 * position that gained can leave it holding less than what
 * was put into it. The `fundId` travels with the read model
 * because a holding is only meaningful against the fund it
 * holds, and the bank of that fund is what a custodian
 * distribution groups by.
 *
 * @explanation
 * Use this DTO when exposing the effective share of a
 * portfolio to the consumers of the service layer. The share
 * and the money come from the same pass, so a caller never
 * has to re-derive the invested value to size a holding.
 *
 * @example
 * const RESPONSE = {
 *   positionId: "position-1",
 *   portfolioId: "portfolio-1",
 *   fundId: "fund-1",
 *   weight: "90.00",
 *   investedValue: "90000",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface PositionWeightResponseDTO {
  positionId: string
  portfolioId: string
  // Fund the position holds, resolved by the caller into
  // the fund name and the bank that custodies it.
  fundId: string
  // Share of the portfolio the position holds (%).
  weight: string
  // Money currently invested in the position.
  investedValue: string
}
