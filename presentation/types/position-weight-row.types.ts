/**
 * @summary
 * Share a position holds of its portfolio, and the money
 * behind it.
 *
 * @remarks
 * Projects the weight read model onto the fields the
 * screens render. The share and the money stay decimal
 * strings so the presenters are the only place that
 * formats them.
 *
 * @explanation
 * Use this type in dialogs, forms and hooks. The route
 * loader maps the response DTO into it, so no view file
 * depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface PositionWeightRow {
  positionId: string
  portfolioId: string
  // Fund the position holds, resolved by the route into
  // the fund name and the bank that custodies it.
  fundId: string
  // Share of the portfolio the position holds (%).
  weight: string
  // Money currently invested in the position.
  investedValue: string
}
