import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * The direction of a monthly movement, read as the extrato
 * activity kind.
 */
export type StatementReportMovementKind =
  "application" | "withdrawal"

/**
 * @summary
 * A single "money in or out" row of the monthly statement,
 * already resolved by the extrato activity pipeline.
 *
 * @remarks
 * Carries the fund and the custodian bank names next to the
 * date, the direction, the money and the quotas moved, so
 * the document renders the same columns as the extrato
 * activity datatable.
 */
export interface StatementReportMovement {
  date: string
  kind: StatementReportMovementKind
  fundName: string
  bankName: string
  amount: string
  quotas: string
}

/**
 * @summary
 * A single fund position row of the monthly statement,
 * already resolved by the shared holding mapper of the
 * extrato.
 *
 * @remarks
 * Mirrors the extrato positions datatable: the fund, the
 * custodian bank with its code, the share of the portfolio
 * the position holds and the money invested through it.
 */
export interface StatementReportPositionRow {
  fundName: string
  bankName: string
  bankCode: string
  weight: string
  investedValue: string
}

/**
 * @summary
 * The money and return figures that close the month.
 *
 * @remarks
 * Mirrors the extrato summary block: the closing patrimony
 * as the headline figure, the chained month return next to
 * it and the reconciliation entries that explain how the
 * opening balance became the closing one.
 */
export interface StatementReportSummary {
  // Closing snapshot day of the month, or `null` when the
  // month holds no snapshot.
  patrimonyClosingDate: string | null
  // Closing patrimony of the month, or `null` when the
  // month holds no snapshot.
  patrimonyFinal: string | null
  // Patrimony measured before the month opens, or `null`
  // when the month starts at the first snapshot.
  patrimonyOpening: string | null
  // Money that entered the month, from the shared window
  // cash flows of the performance snapshots.
  applicationsTotal: string
  // Money that left the month, from the shared window cash
  // flows of the performance snapshots.
  withdrawalsTotal: string
  // Market result of the month, as a signed amount.
  result: string
  // Chained month return resolved by the shared period
  // returns use case. Null when it cannot be resolved.
  monthlyReturn: string | null
}

/**
 * @summary
 * The report model rendered by the statement PDF.
 *
 * @remarks
 * Carries display-ready values: dates and amounts stay
 * raw strings, and derived labels and figures are
 * computed once by the report mapper through the shared
 * period calculators and formatted by the document.
 * Amounts are decimal strings so float drift never
 * enters the pipeline.
 *
 * @explanation
 * Use this model to render the monthly statement
 * document with **react-pdf**. It is the single
 * contract between the report mapper and the PDF view.
 *
 * @example
 * const DATA = BuildStatementReportData(SOURCE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export interface StatementReportData {
  portfolio: PortfolioResponseDTO
  month: string
  periodStart: string
  periodEnd: string
  // The `MMMM de yyyy` label of the month.
  periodLabel: string
  // The UTC instant the file was rendered at.
  issuedAt: string
  // The extrato summary block that opens the statement.
  summary: StatementReportSummary
  // The holdings of the portfolio, newest position first.
  positions: StatementReportPositionRow[]
  // The movements inside the month, newest first.
  movements: StatementReportMovement[]
}
