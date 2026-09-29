/**
 * @summary
 * Position row rendered by the presentation layer.
 *
 * @remarks
 * Projects the position read model onto the fields
 * the screens actually render. Every money and quota
 * value stays a decimal string so the presenters are
 * the only place that formats it.
 *
 *The `initialBalanceDate`, `version`, `updatedAt` fields stay in
 *  the service layer.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface PositionRow {
  id: string
  portfolioId: string
  fundId: string
  initialBalance: string | null
  // Share of the portfolio the position represents (%).
  allocation: string
  // Initial balance date for performance calc.
  initialBalanceDate: string | null
  // Optimistic-locking version.
  version: number
  // Audit timestamp.
  updatedAt: string
  createdAt: string
}
