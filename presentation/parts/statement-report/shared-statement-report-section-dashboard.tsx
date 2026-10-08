import { Path, Svg, Text, View } from "@react-pdf/renderer"
import type { ReactElement } from "react"

import {
  FormatCurrency,
  FormatSignedCurrency,
} from "@/presentation/presenters/currency.presenter"
import {
  FormatSignedPercentage,
  FormatUnsignedPercentage,
} from "@/presentation/presenters/percentage.presenter"
import type { StatementReportData } from "@/services/statement/report/statement-report.types"

import {
  StatementReportGauge,
  StatementReportHorizontalBars,
} from "./shared-statement-report-charts"
import {
  STATEMENT_REPORT_COPY,
  STATEMENT_REPORT_PALETTE,
} from "./shared-statement-report.settings"
import { tw } from "./shared-statement-report-styles.constants"

// The direction a signed figure points to, if any.
type KpiTrend = "up" | "down" | null

// The caret-up glyph of `public/caret-up.svg`. The asset is
// not rendered through `<Image>` because it paints its root
// `fill="currentColor"` on the `svg` element, which react-pdf
// drops when it converts the buffer, so the glyph would end up
// painted with zero alpha. Inlining the path keeps the same
// glyph and lets the fill take the tone color directly.
const CARET_UP_PATH =
  "M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z"

// The caret-down glyph of `public/caret-down.svg`, inlined for
// the same reasons as `CARET_UP_PATH`.
const CARET_DOWN_PATH =
  "M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z"

/**
 * Picks the arrow direction of a signed figure. A missing or
 * flat value has no arrow.
 */
function TrendOf(value: string | null): KpiTrend {
  if (value === null) return null

  const AMOUNT = Number.parseFloat(value)
  if (AMOUNT > 0) return "up"
  if (AMOUNT < 0) return "down"
  return null
}

/**
 * Builds the caption and arrow of a signed-figure KPI. When
 * the arrow states the direction, the caption shows only the
 * magnitude, so the `+` of the signed formatters never sits
 * next to the arrow.
 */
function BuildFigureCard(
  value: string | null,
  signed: string,
  unsigned: string
): { value: string; trend: KpiTrend } {
  const TREND = TrendOf(value)

  return {
    value: TREND === null ? signed : unsigned,
    trend: TREND,
  }
}

// One KPI card of the dashboard.
function KpiCard(props: {
  label: string
  value: string
  trend?: KpiTrend
}): ReactElement {
  const TREND_COLOR =
    props.trend === "up"
      ? STATEMENT_REPORT_PALETTE.positive
      : props.trend === "down"
        ? STATEMENT_REPORT_PALETTE.negative
        : null

  return (
    <View
      style={tw("flex-row gap-2 items-center justify-start")}
    >
      {TREND_COLOR !== null && (
        <Svg width={12} height={12} viewBox="0 0 24 24">
          <Path
            d={
              props.trend === "up"
                ? CARET_UP_PATH
                : CARET_DOWN_PATH
            }
            fill={TREND_COLOR}
          />
        </Svg>
      )}
      <View
        style={tw("flex-col gap-1 items-start justify-start")}
      >
        <Text style={tw("text-sm text-subdued font-medium")}>
          {props.label}
        </Text>
        <Text style={tw("text-base text-foreground")}>
          {props.value}
        </Text>
      </View>
    </View>
  )
}

/**
 * @summary
 * Renders the executive dashboard of the report.
 *
 * @remarks
 * Puts the five KPI cards on one row, the return against
 * the target gauge beside the comparison against the
 * indexes, and the month return chart of the year under
 * them.
 *
 * @explanation
 * Use this component as the second page of the statement
 * document, after the cover.
 *
 * @param data - The report model to render.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function DashboardSection(props: {
  data: StatementReportData
}): ReactElement {
  const KPIS = props.data.kpis

  const COMPARISON = props.data.indexComparison.map((row) => ({
    label: row.name,
    value: row.share === null ? 0 : Number.parseFloat(row.share),
    color: STATEMENT_REPORT_PALETTE.brandBlue,
    display:
      row.share === null
        ? STATEMENT_REPORT_COPY.unavailable
        : FormatUnsignedPercentage(row.share),
  }))

  const GAUGE_VALUE =
    KPIS.targetShare === null
      ? null
      : Number.parseFloat(KPIS.targetShare)

  const MONTHLY_RETURN = BuildFigureCard(
    KPIS.monthlyReturn,
    FormatSignedPercentage(KPIS.monthlyReturn),
    FormatUnsignedPercentage(
      Math.abs(Number.parseFloat(KPIS.monthlyReturn ?? "0"))
    )
  )

  const YEARLY_RETURN = BuildFigureCard(
    KPIS.yearlyReturn,
    FormatSignedPercentage(KPIS.yearlyReturn),
    FormatUnsignedPercentage(
      Math.abs(Number.parseFloat(KPIS.yearlyReturn ?? "0"))
    )
  )

  const MONTHLY_GAINS = BuildFigureCard(
    KPIS.monthlyGains,
    FormatSignedCurrency(KPIS.monthlyGains),
    FormatCurrency(
      Math.abs(Number.parseFloat(KPIS.monthlyGains))
    )
  )

  const ACCUMULATED_GAINS = BuildFigureCard(
    KPIS.accumulatedGains,
    FormatSignedCurrency(KPIS.accumulatedGains),
    FormatCurrency(
      Math.abs(Number.parseFloat(KPIS.accumulatedGains))
    )
  )

  return (
    <View style={tw("flex-col gap-16")}>
      <View style={tw("flex-col gap-4")}>
        <View style={tw("flex-col")}>
          <Text
            style={tw(
              "text-base font-bold text-foreground text-2xl"
            )}
          >
            Uma visão geral dos principais indicadores da sua
            carteira.
          </Text>
        </View>
        <View
          style={tw(
            "flex-row justify-between items-center mt-1"
          )}
        >
          <KpiCard
            label={STATEMENT_REPORT_COPY.kpiMonthlyReturn}
            value={MONTHLY_RETURN.value}
            trend={MONTHLY_RETURN.trend}
          />
          <KpiCard
            label={STATEMENT_REPORT_COPY.kpiYearlyReturn}
            value={YEARLY_RETURN.value}
            trend={YEARLY_RETURN.trend}
          />
          <KpiCard
            label={STATEMENT_REPORT_COPY.kpiMonthlyGains}
            value={MONTHLY_GAINS.value}
            trend={MONTHLY_GAINS.trend}
          />
          <KpiCard
            label={STATEMENT_REPORT_COPY.kpiAccumulatedGains}
            value={ACCUMULATED_GAINS.value}
            trend={ACCUMULATED_GAINS.trend}
          />
          <KpiCard
            label={STATEMENT_REPORT_COPY.kpiTotalPatrimony}
            value={FormatCurrency(KPIS.totalPatrimony)}
          />
        </View>
      </View>
      <View
        style={tw("flex-row justify-between items-start gap-8")}
      >
        <View
          style={tw(
            "flex-col justify-start items-start gap-2 w-1/2"
          )}
        >
          <Text
            style={tw(
              "text-sm font-bold text-foreground italic"
            )}
          >
            {STATEMENT_REPORT_COPY.gaugeTitle}
          </Text>
          <StatementReportGauge value={GAUGE_VALUE} />
        </View>
        <View
          style={tw(
            "flex-col justify-start items-start gap-2 flex-1 w-1/2"
          )}
        >
          <Text
            style={tw(
              "text-sm font-bold text-foreground italic"
            )}
          >
            {STATEMENT_REPORT_COPY.indexComparisonTitle}
          </Text>
          <StatementReportHorizontalBars rows={COMPARISON} />
        </View>
      </View>
    </View>
  )
}
