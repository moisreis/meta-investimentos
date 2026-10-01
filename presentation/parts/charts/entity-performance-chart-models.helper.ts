import type { DateRange } from "react-day-picker"

import type {
  EntityChartModel,
  EntityChartSeries,
} from "@/presentation/parts/charts/entity-chart.types"
import {
  FormatCompactCurrency,
  FormatCurrency,
} from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import {
  ResolvePeriodWindow,
  type PerformanceSnapshot,
} from "@/services/portfolio-performance/calculators/period-window.calculator"

// Copy keys of the performance section of a detail screen.
// The constants of a route satisfy this interface, so the
// builder reads the same keys the portfolio and the position
// labels declare.
export interface PerformanceChartLabels {
  PATRIMONY_TITLE: string
  PATRIMONY_DESCRIPTION: string
  PATRIMONY_SERIES: string
  PATRIMONY_REFERENCE: string
  RETURN_TITLE: string
  RETURN_DESCRIPTION: string
  RETURN_SERIES_DAILY: string
  RETURN_SERIES_MONTHLY: string
  RETURN_SERIES_YEARLY: string
  RESULT_TITLE: string
  RESULT_DESCRIPTION: string
  RESULT_SERIES_EARNINGS: string
  MOVEMENT_TITLE: string
  MOVEMENT_DESCRIPTION: string
  MOVEMENT_SERIES_CASH_FLOW: string
}

// Names a chart container id inside the scope of its screen,
// so the generated gradient and the injected colors of the
// portfolio never collide with the ones of the position.
function ChartId(scope: string, name: string): string {
  return `${scope}-${name}`
}

// Formats a snapshot timestamp as a short `dd/MM` UTC day,
// so the axis of a month-long window stays readable.
function FormatChartDay(date: string): string {
  const DAY = new Date(date)
  const DATE = String(DAY.getUTCDate()).padStart(2, "0")
  const MONTH = String(DAY.getUTCMonth() + 1).padStart(2, "0")
  return `${DATE}/${MONTH}`
}

// Parses a snapshot field to a finite amount, keeping a
// missing value missing so a return that does not exist yet
// leaves a gap in the line instead of dropping the series.
function ToNullableAmount(
  value: string | null | undefined
): number | null {
  if (value === null || value === undefined) return null
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : null
}

// Series of the patrimony chart, in **BRL**.
function BuildPatrimonySeries(
  labels: PerformanceChartLabels
): EntityChartSeries[] {
  return [
    {
      key: "patrimony",
      label: labels.PATRIMONY_SERIES,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
    },
  ]
}

// Series of the daily result chart. Takes a `sign` tone so a
// day that earned reads green and a day that lost reads red.
function BuildResultSeries(
  labels: PerformanceChartLabels
): EntityChartSeries[] {
  return [
    {
      key: "earnings",
      label: labels.RESULT_SERIES_EARNINGS,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
      tone: "sign",
    },
  ]
}

// Series of the cash movement chart, also signed, so an
// application reads against a redemption at a glance.
function BuildMovementSeries(
  labels: PerformanceChartLabels
): EntityChartSeries[] {
  return [
    {
      key: "cashFlowNet",
      label: labels.MOVEMENT_SERIES_CASH_FLOW,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
      tone: "sign",
    },
  ]
}

// Series of the return chart, in percent units. The longer
// horizons are nullable in the snapshot, so they render as a
// gap until the window is long enough to hold them.
function BuildReturnSeries(
  labels: PerformanceChartLabels
): EntityChartSeries[] {
  return [
    {
      key: "returnDaily",
      label: labels.RETURN_SERIES_DAILY,
      formatValue: FormatSignedPercentage,
    },
    {
      key: "returnMonthly",
      label: labels.RETURN_SERIES_MONTHLY,
      formatValue: FormatSignedPercentage,
    },
    {
      key: "returnYearly",
      label: labels.RETURN_SERIES_YEARLY,
      formatValue: FormatSignedPercentage,
    },
  ]
}

/**
 * @summary
 * Builds the patrimony chart of an entity detail screen.
 *
 * @remarks
 * Plots the closing patrimony of every snapshot of the window
 * as a filled area and anchors it to the snapshot the window
 * opened at, so the reader sees the gain of the period without
 * having to remember the previous value.
 *
 * @param snapshots - The snapshots inside the window.
 * @param opening - The snapshot before the window opens, or
 *   `null` when the window starts at the first snapshot.
 * @param labels - The copy of the performance section.
 * @param scope - Id prefix of the owning screen.
 *
 * @returns The patrimony chart model.
 *
 * @example
 * const MODEL = BuildPatrimonyChart(WINDOW.inWindow, WINDOW.opening);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
function BuildPatrimonyChart(
  snapshots: readonly PerformanceSnapshot[],
  opening: PerformanceSnapshot | null,
  labels: PerformanceChartLabels,
  scope: string
): EntityChartModel {
  const OPENING_PATRIMONY = opening
    ? ToNullableAmount(opening.patrimony)
    : null

  return {
    id: ChartId(scope, "patrimony"),
    title: labels.PATRIMONY_TITLE,
    description: labels.PATRIMONY_DESCRIPTION,
    kind: "area",
    series: BuildPatrimonySeries(labels),
    points: snapshots.map((snapshot) => ({
      label: FormatChartDay(snapshot.date),
      values: {
        patrimony: ToNullableAmount(snapshot.patrimony),
      },
    })),
    references:
      OPENING_PATRIMONY === null
        ? undefined
        : [
            {
              value: OPENING_PATRIMONY,
              label: labels.PATRIMONY_REFERENCE,
            },
          ],
  }
}

/**
 * @summary
 * Builds the return chart of an entity detail screen.
 *
 * @remarks
 * Draws the daily return as a line over the monthly and
 * yearly returns, which the snapshots already carry
 * accumulated from their own horizon anchors. The longer
 * horizons stay out of the line while they are missing, so a
 * short window does not pretend to hold a yearly return.
 *
 * @param snapshots - The snapshots inside the window.
 * @param labels - The copy of the performance section.
 * @param scope - Id prefix of the owning screen.
 *
 * @returns The return chart model.
 *
 * @example
 * const MODEL = BuildReturnChart(WINDOW.inWindow);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
function BuildReturnChart(
  snapshots: readonly PerformanceSnapshot[],
  labels: PerformanceChartLabels,
  scope: string
): EntityChartModel {
  return {
    id: ChartId(scope, "return"),
    title: labels.RETURN_TITLE,
    description: labels.RETURN_DESCRIPTION,
    kind: "line",
    series: BuildReturnSeries(labels),
    points: snapshots.map((snapshot) => ({
      label: FormatChartDay(snapshot.date),
      values: {
        returnDaily: ToNullableAmount(snapshot.returnDaily),
        returnMonthly: ToNullableAmount(snapshot.returnMonthly),
        returnYearly: ToNullableAmount(snapshot.returnYearly),
      },
    })),
  }
}

/**
 * @summary
 * Builds the daily result chart of an entity detail screen.
 *
 * @remarks
 * Plots the earnings of the market of every day of the
 * window, signed by direction. Reads next to the cash
 * movement chart to tell a gain apart from a contribution:
 * the two series live on their own scales on purpose,
 * because the first application is orders of magnitude
 * larger than a day of market movement and a shared axis
 * would flatten every bar to a pixel.
 *
 * @param snapshots - The snapshots inside the window.
 * @param labels - The copy of the performance section.
 * @param scope - Id prefix of the owning screen.
 *
 * @returns The daily result chart model.
 *
 * @example
 * const MODEL = BuildResultChart(WINDOW.inWindow);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
function BuildResultChart(
  snapshots: readonly PerformanceSnapshot[],
  labels: PerformanceChartLabels,
  scope: string
): EntityChartModel {
  return {
    id: ChartId(scope, "result"),
    title: labels.RESULT_TITLE,
    description: labels.RESULT_DESCRIPTION,
    kind: "bar",
    series: BuildResultSeries(labels),
    points: snapshots.map((snapshot) => ({
      label: FormatChartDay(snapshot.date),
      values: {
        earnings: ToNullableAmount(snapshot.earnings),
      },
    })),
  }
}

/**
 * @summary
 * Builds the cash movement chart of an entity detail screen.
 *
 * @remarks
 * Plots the net cash flow of every day of the window, so a
 * day the user contributed reads differently from a day the
 * entity merely gained. The flow is net, so an application
 * and a redemption on the same day cancel out exactly as
 * they do in the patrimony.
 *
 * @param snapshots - The snapshots inside the window.
 * @param labels - The copy of the performance section.
 * @param scope - Id prefix of the owning screen.
 *
 * @returns The cash movement chart model.
 *
 * @example
 * const MODEL = BuildMovementChart(WINDOW.inWindow);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
function BuildMovementChart(
  snapshots: readonly PerformanceSnapshot[],
  labels: PerformanceChartLabels,
  scope: string
): EntityChartModel {
  return {
    id: ChartId(scope, "movement"),
    title: labels.MOVEMENT_TITLE,
    description: labels.MOVEMENT_DESCRIPTION,
    kind: "bar",
    series: BuildMovementSeries(labels),
    points: snapshots.map((snapshot) => ({
      label: FormatChartDay(snapshot.date),
      values: {
        cashFlowNet: ToNullableAmount(snapshot.cashFlowNet),
      },
    })),
  }
}

/**
 * @summary
 * Builds the performance charts of an entity detail screen.
 *
 * @remarks
 * Clamps the snapshot series to the selected `[from, to]`
 * window through the shared period window calculator — the
 * same one the summary and the chained returns read — and
 * derives the patrimony, the return, the daily result and the
 * cash movement charts from real registry data. Because
 * every chart and every block is fed by one window, a number
 * a chart shows can never disagree with the summary above it.
 * Returns an empty array when the window holds no snapshot,
 * so the screen shows no chart at all instead of an empty
 * frame.
 *
 * @explanation
 * Use this helper from a route overview hook, passing its
 * own copy and id scope. It is pure, so the models can be
 * asserted without a browser and a chart can be added later
 * by adding one builder and one entry here.
 *
 * @param snapshots - The daily snapshots of the entity, in
 *   any order.
 * @param dateRange - The selected window. Days fall back to
 *   the earliest and latest snapshot when omitted.
 * @param labels - The copy of the performance section.
 * @param scope - Id prefix of the owning screen.
 *
 * @returns The chart models, in render order.
 *
 * @example
 * const MODELS = BuildPerformanceChartModels(SNAPSHOTS, RANGE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export function BuildPerformanceChartModels(
  snapshots: readonly PerformanceSnapshot[],
  dateRange: DateRange | undefined,
  labels: PerformanceChartLabels,
  scope: string
): EntityChartModel[] {
  const WINDOW = ResolvePeriodWindow(
    snapshots,
    dateRange?.from ?? null,
    dateRange?.to ?? null
  )

  if (WINDOW.inWindow.length === 0) return []

  return [
    BuildPatrimonyChart(
      WINDOW.inWindow,
      WINDOW.opening,
      labels,
      scope
    ),
    BuildReturnChart(WINDOW.inWindow, labels, scope),
    BuildResultChart(WINDOW.inWindow, labels, scope),
    BuildMovementChart(WINDOW.inWindow, labels, scope),
  ]
}
