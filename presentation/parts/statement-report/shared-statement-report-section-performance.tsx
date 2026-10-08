import { Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

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

  return (
    <View style={tw("flex-col gap-6")}>
      <View>
        <Text style={tw("text-sm font-bold text-foreground")}>
          {STATEMENT_REPORT_COPY.performanceTitle}
        </Text>
        <Text style={tw("text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.performanceSubtitle}
        </Text>
        <View style={tw("flex-row gap-3 mt-2 mb-1")}>
          {PORTFOLIO_SERIES.map((series) => (
            <View
              key={series.name}
              style={tw("flex-row items-center gap-1")}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: series.color,
                }}
              />
              <Text style={tw("text-xs text-subdued")}>
                {series.name}
              </Text>
            </View>
          ))}
        </View>
        <StatementReportBarChart
          groups={PERFORMANCE}
          series={PORTFOLIO_SERIES}
          width={740}
          height={170}
        />
      </View>

      <View>
        <Text style={tw("text-sm font-bold text-foreground")}>
          {STATEMENT_REPORT_COPY.earningsTitle}
        </Text>
        <Text style={tw("text-xs text-subdued")}>
          {STATEMENT_REPORT_COPY.earningsSubtitle}
        </Text>
        <View style={tw("flex-row gap-3 mt-2 mb-1")}>
          <LegendItem
            color={STATEMENT_REPORT_PALETTE.brandBlue}
            label="Aumentar"
          />
          <LegendItem
            color={STATEMENT_REPORT_PALETTE.negative}
            label="Diminuir"
          />
          <LegendItem
            color={STATEMENT_REPORT_PALETTE.primary}
            label={STATEMENT_REPORT_COPY.totalLabel}
          />
        </View>
        <StatementReportBarChart
          groups={EARNINGS}
          series={EARNINGS_SERIES}
          width={740}
          height={150}
        />
      </View>
    </View>
  )
}

/**
 * Renders a single legend swatch of a chart.
 */
function LegendItem(props: {
  color: string
  label: string
}): ReactElement {
  return (
    <View style={tw("flex-row items-center gap-1")}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: props.color,
        }}
      />
      <Text style={tw("text-xs text-subdued")}>
        {props.label}
      </Text>
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
