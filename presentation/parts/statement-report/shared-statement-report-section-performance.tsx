import { View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import { FormatSignedCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import {
  StatementReportBarChart,
  type StatementReportBarGroup,
  type StatementReportBarSeries,
} from "./shared-statement-report-charts"
import {
  STATEMENT_REPORT_COPY,
  STATEMENT_REPORT_PALETTE,
} from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

/**
 * @summary
 * Renders the month-by-month performance of the portfolio.
 *
 * @remarks
 * Puts the return against the target of every month of the
 * reference year side by side, closed by a `Total` column
 * with the accumulated figures, then the signed earnings of
 * every month as a bar that reads blue when it grew and red
 * when it shrank, closed by a green accumulator.
 *
 * @explanation
 * Use this component as the "Desempenho da Carteira" and
 * "Rendimento Mensal" block of the statement document.
 *
 * @param data - The report model to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function PerformanceSection(props: {
  data: StatementReportData
}): ReactElement {
  const DATA = props.data

  const TOTAL_CARTEIRA =
    DATA.accumulatedIndexes.find(
      (row) => row.name === "Carteira"
    )?.rate ?? null
  const TOTAL_META =
    DATA.accumulatedIndexes.find((row) => row.name === "Meta")
      ?.rate ?? null

  const PERFORMANCE: StatementReportBarGroup[] = [
    ...DATA.performance.map((point) => ({
      label: point.label,
      values: [
        ToNumber(point.portfolio),
        ToNumber(point.target),
      ],
    })),
    {
      label: STATEMENT_REPORT_COPY.totalLabel,
      values: [ToNumber(TOTAL_CARTEIRA), ToNumber(TOTAL_META)],
    },
  ]

  const EARNINGS: StatementReportBarGroup[] = [
    ...DATA.monthlyEarnings.map((point) => {
      const VALUE = Number.parseFloat(point.earnings)
      return {
        label: point.label,
        values: [Number.isFinite(VALUE) ? VALUE : null],
        colors: [
          VALUE < 0
            ? STATEMENT_REPORT_PALETTE.negative
            : STATEMENT_REPORT_PALETTE.brandBlue,
        ],
      }
    }),
    {
      label: STATEMENT_REPORT_COPY.totalLabel,
      values: [ToNumber(DATA.kpis.accumulatedGains)],
      colors: [STATEMENT_REPORT_PALETTE.primary],
    },
  ]

  const PORTFOLIO_SERIES: StatementReportBarSeries[] = [
    {
      name: STATEMENT_REPORT_COPY.carteiraLabel,
      color: STATEMENT_REPORT_PALETTE.primary,
    },
    {
      name: STATEMENT_REPORT_COPY.metaLabel,
      color: STATEMENT_REPORT_PALETTE.brandBlue,
    },
  ]

  const EARNINGS_SERIES: StatementReportBarSeries[] = [
    {
      name: STATEMENT_REPORT_COPY.earningsTitle,
      color: STATEMENT_REPORT_PALETTE.brandBlue,
    },
  ]

  const EARNINGS_LEGEND: StatementReportBarSeries[] = [
    {
      name: "Aumentar",
      color: STATEMENT_REPORT_PALETTE.brandBlue,
    },
    {
      name: "Diminuir",
      color: STATEMENT_REPORT_PALETTE.negative,
    },
    {
      name: STATEMENT_REPORT_COPY.totalLabel,
      color: STATEMENT_REPORT_PALETTE.primary,
    },
  ]

  return (
    <View style={tw("flex-col gap-6")}>
      <StatementReportBarChart
        title={STATEMENT_REPORT_COPY.performanceTitle}
        groups={PERFORMANCE}
        series={PORTFOLIO_SERIES}
        legend={PORTFOLIO_SERIES}
        formatValue={FormatSignedPercentage}
        width={740}
        height={170}
      />

      <View style={tw("border-t border-border")} />

      <StatementReportBarChart
        title={STATEMENT_REPORT_COPY.earningsTitle}
        groups={EARNINGS}
        series={EARNINGS_SERIES}
        legend={EARNINGS_LEGEND}
        formatValue={FormatSignedCurrency}
        width={740}
        height={150}
      />
    </View>
  )
}

/**
 * Parses a report figure into a chart number, keeping a
 * missing figure as `null`.
 */
function ToNumber(value: string | null): number | null {
  if (value === null) return null
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : null
}
