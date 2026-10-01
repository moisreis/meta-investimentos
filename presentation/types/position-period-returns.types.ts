/**
 * @summary
 * Period returns resolved for a position.
 *
 * @remarks
 * The calendar-year, calendar-month and selected-window
 * returns of the chosen position, as chained decimal
 * strings.
 *
 * @explanation
 * Use this type in the position overview KPI cards.
 * The action and the KPI helper share it so the
 * presentation layer never names the use case output.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface PositionPeriodReturns {
  // Chained year return. Null when the horizon cannot be
  // resolved.
  yearReturn: string | null

  // Chained month return. Null when the horizon cannot be
  // resolved.
  monthReturn: string | null

  // Chained return of the selected window. Null when the
  // window holds fewer than two usable daily returns.
  periodReturn: string | null
}
