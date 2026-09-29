/**
 * @summary
 * Period returns resolved for a portfolio.
 *
 * @remarks
 * The calendar-year and calendar-month returns of the
 * selected portfolio, as decimal strings.
 *
 * @explanation
 * Use this type in the portfolio overview KPI cards.
 * The action and the KPI helper share it so the
 * presentation layer never names the use case output.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface PortfolioPeriodReturns {
  yearReturn: string | null
  monthReturn: string | null
}
