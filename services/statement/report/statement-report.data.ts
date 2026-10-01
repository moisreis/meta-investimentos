import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"
import type { PortfolioHolding } from "@/presentation/types/portfolio-holding.types"
import {
  SumSeriesCashFlows,
  SumSeriesEarnings,
  type PeriodWindow,
} from "@/lib/performance/period-window.calculator"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import type {
  StatementReportData,
  StatementReportMovement,
  StatementReportPositionRow,
} from "./statement-report.types"

/**
 * The shared inputs a finished statement report is built
 * from.
 *
 * @remarks
 * The holdings and the movements are the exact read models
 * of the extrato pipeline: the holdings come from the shared
 * holding mapper that the portfolio overview resolves, and
 * the movements are the monthly activity rows the extrato
 * datatables render, already windowed and reversal-free. The
 * window and the month return are the shared period
 * calculators of the portfolio performance registry. Nothing
 * here is summed, filtered or queried again by the report
 * mapper.
 */
export interface StatementReportSource {
  portfolio: PortfolioResponseDTO
  month: string
  periodStart: string
  periodEnd: string
  // Holdings of the portfolio, resolved by the shared holding
  // mapper of the extrato, by weight.
  holdings: PortfolioHolding[]
  // The monthly activity rows of the extrato, already
  // windowed and reversal-free, newest first.
  movements: PortfolioActivityRow[]
  // The month window over the portfolio snapshots, closed by
  // the shared period window calculator.
  window: PeriodWindow<PortfolioPerformanceResponseDTO>
  // Chained month return of the window, resolved by the
  // shared period returns use case.
  monthReturn: string | null
}

/**
 * @summary
 * Builds the statement report model from the shared data.
 *
 * @remarks
 * Projects the extrato read models onto the report rows and
 * closes the summary through the shared period window
 * calculator: the deposits, the withdrawals and the result
 * of the month come from the daily net cash flows and
 * earnings of the snapshots, the patrimony figures come from
 * the opening and the closing snapshots and the monthly
 * return is the chained figure of the period returns use
 * case. The mapper never filters, sums or queries anything
 * itself — it only relabels the figures the screens already
 * computed.
 *
 * @explanation
 * Use this mapper to prepare the data that the statement PDF
 * renders. It stays pure and never touches repositories or
 * the document layer.
 *
 * @param source - The shared report inputs.
 *
 * @returns The display-ready report model.
 *
 * @example
 * const DATA = BuildStatementReportData(SOURCE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export function BuildStatementReportData(
  source: StatementReportSource
): StatementReportData {
  const FLOWS = SumSeriesCashFlows(source.window.inWindow)
  const RESULT = SumSeriesEarnings(source.window.inWindow)

  return {
    portfolio: source.portfolio,
    month: source.month,
    periodStart: source.periodStart,
    periodEnd: source.periodEnd,
    periodLabel: BuildMonthLabel(source.month),
    issuedAt: new Date().toISOString(),
    summary: {
      patrimonyClosingDate: source.window.end?.date ?? null,
      patrimonyFinal: source.window.end?.patrimony ?? null,
      patrimonyOpening: source.window.opening?.patrimony ?? null,
      applicationsTotal: FLOWS.deposits.toFixed(2),
      withdrawalsTotal: FLOWS.withdrawals.toFixed(2),
      result: RESULT.toFixed(2),
      monthlyReturn: source.monthReturn,
    },
    positions: source.holdings.map(ToPositionRow),
    movements: source.movements.map(ToMovement),
  }
}

/**
 * Projects a holding onto the report position row.
 */
function ToPositionRow(
  holding: PortfolioHolding
): StatementReportPositionRow {
  return {
    fundName: holding.fundName,
    bankName: holding.bankName,
    bankCode: holding.bankCode,
    weight: holding.weight,
    investedValue: holding.investedValue,
  }
}

/**
 * Projects an extrato activity row onto the report movement
 * row, keeping the shared pipeline order (newest first).
 */
function ToMovement(
  movement: PortfolioActivityRow
): StatementReportMovement {
  return {
    date: movement.date,
    kind: movement.kind,
    fundName: movement.fundName,
    bankName: movement.bankName,
    amount: movement.amount,
    quotas: movement.quotas,
  }
}

/**
 * Builds the `MMMM de yyyy` label of a month key.
 */
function BuildMonthLabel(month: string): string {
  const [YEAR, MONTH_NUMBER] = month.split("-").map(Number)
  const FIRST_DAY = new Date(Date.UTC(YEAR, MONTH_NUMBER - 1, 1))
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(FIRST_DAY)
}
