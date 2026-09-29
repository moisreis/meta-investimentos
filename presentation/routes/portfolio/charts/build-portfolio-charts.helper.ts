import type { DateRange } from "react-day-picker"

import type {
  EntityChartModel,
  EntityChartSeries,
} from "@/presentation/parts/charts/types"
import {
  FormatCompactCurrency,
  FormatCurrency,
} from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import { ResolvePeriodWindow } from "@/services/portfolio-performance/calculators/period-window.calculator"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_CHARTS } from "../settings/labels.settings"

// Keys of the chart container ids, kept stable so the
// generated gradient and the injected colors survive a
// re-render of the same chart.
const PATRIMONY_CHART_ID = "portfolio-patrimony"
const RETURN_CHART_ID = "portfolio-return"
const RESULT_CHART_ID = "portfolio-result"
const MOVEMENT_CHART_ID = "portfolio-movement"

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
function BuildPatrimonySeries(): EntityChartSeries[] {
  return [
    {
      key: "patrimony",
      label: PORTFOLIO_CHARTS.PATRIMONY_SERIES,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
    },
  ]
}

// Series of the daily result chart. Takes a `sign` tone so a
// day that earned reads green and a day that lost reads red.
function BuildResultSeries(): EntityChartSeries[] {
  return [
    {
      key: "earnings",
      label: PORTFOLIO_CHARTS.RESULT_SERIES_EARNINGS,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
      tone: "sign",
    },
  ]
}

// Series of the cash movement chart, also signed, so an
// application reads against a redemption at a glance.
function BuildMovementSeries(): EntityChartSeries[] {
  return [
    {
      key: "cashFlowNet",
      label: PORTFOLIO_CHARTS.MOVEMENT_SERIES_CASH_FLOW,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
      tone: "sign",
    },
  ]
}

// Series of the return chart, in percent units. The longer
// horizons are nullable in the snapshot, so they render as a
// gap until the window is long enough to hold them.
function BuildReturnSeries(): EntityChartSeries[] {
  return [
    {
      key: "returnDaily",
      label: PORTFOLIO_CHARTS.RETURN_SERIES_DAILY,
      formatValue: FormatSignedPercentage,
    },
    {
      key: "returnMonthly",
      label: PORTFOLIO_CHARTS.RETURN_SERIES_MONTHLY,
      formatValue: FormatSignedPercentage,
    },
    {
      key: "returnYearly",
      label: PORTFOLIO_CHARTS.RETURN_SERIES_YEARLY,
      formatValue: FormatSignedPercentage,
    },
  ]
}

/**
 * @summary
 * Builds the patrimony chart of the portfolio detail screen.
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
 *
 * @returns The patrimony chart model.
 *
 * @example
 * const MODEL = BuildPatrimonyChart(WINDOW.inWindow, WINDOW.opening);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildPatrimonyChart(
  snapshots: readonly PortfolioPerformanceResponseDTO[],
  opening: PortfolioPerformanceResponseDTO | null
): EntityChartModel {
  const OPENING_PATRIMONY = opening
    ? ToNullableAmount(opening.patrimony)
    : null

  return {
    id: PATRIMONY_CHART_ID,
    title: PORTFOLIO_CHARTS.PATRIMONY_TITLE,
    description: PORTFOLIO_CHARTS.PATRIMONY_DESCRIPTION,
    kind: "area",
    series: BuildPatrimonySeries(),
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
              label: PORTFOLIO_CHARTS.PATRIMONY_REFERENCE,
            },
          ],
  }
}

/**
 * @summary
 * Builds the return chart of the portfolio detail screen.
 *
 * @remarks
 * Draws the daily return as a line over the monthly and
 * yearly returns, which the snapshots already carry
 * accumulated from their own horizon anchors. The longer
 * horizons stay out of the line while they are missing, so a
 * short window does not pretend to hold a yearly return.
 *
 * @param snapshots - The snapshots inside the window.
 *
 * @returns The return chart model.
 *
 * @example
 * const MODEL = BuildReturnChart(WINDOW.inWindow);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildReturnChart(
  snapshots: readonly PortfolioPerformanceResponseDTO[]
): EntityChartModel {
  return {
    id: RETURN_CHART_ID,
    title: PORTFOLIO_CHARTS.RETURN_TITLE,
    description: PORTFOLIO_CHARTS.RETURN_DESCRIPTION,
    kind: "line",
    series: BuildReturnSeries(),
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
 * Builds the daily result chart of the portfolio detail
 * screen.
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
 *
 * @returns The daily result chart model.
 *
 * @example
 * const MODEL = BuildResultChart(WINDOW.inWindow);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildResultChart(
  snapshots: readonly PortfolioPerformanceResponseDTO[]
): EntityChartModel {
  return {
    id: RESULT_CHART_ID,
    title: PORTFOLIO_CHARTS.RESULT_TITLE,
    description: PORTFOLIO_CHARTS.RESULT_DESCRIPTION,
    kind: "bar",
    series: BuildResultSeries(),
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
 * Builds the cash movement chart of the portfolio detail
 * screen.
 *
 * @remarks
 * Plots the net cash flow of every day of the window, so a
 * day the user contributed reads differently from a day the
 * portfolio merely gained. The flow is net, so an
 * application and a redemption on the same day cancel out
 * exactly as they do in the patrimony.
 *
 * @param snapshots - The snapshots inside the window.
 *
 * @returns The cash movement chart model.
 *
 * @example
 * const MODEL = BuildMovementChart(WINDOW.inWindow);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildMovementChart(
  snapshots: readonly PortfolioPerformanceResponseDTO[]
): EntityChartModel {
  return {
    id: MOVEMENT_CHART_ID,
    title: PORTFOLIO_CHARTS.MOVEMENT_TITLE,
    description: PORTFOLIO_CHARTS.MOVEMENT_DESCRIPTION,
    kind: "bar",
    series: BuildMovementSeries(),
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
 * Builds the charts of the portfolio detail screen.
 *
 * @remarks
 * Clamps the snapshot series to the selected `[from, to]`
 * window through the shared period window calculator — the
 * same one the KPI cards and the chained returns read — and
 * derives the patrimony, the return, the daily result and the
 * cash movement charts from real registry data. Because
 * every chart and every card is fed by one window, a number
 * a chart shows can never disagree with the card above it.
 * Returns an empty array when the window holds no snapshot,
 * so the screen shows no chart at all instead of an empty
 * frame.
 *
 * @explanation
 * Use this helper from the overview hook. It is pure, so the
 * three models can be asserted without a browser and a chart
 * can be added later by adding one builder and one entry
 * here.
 *
 * @param performances - The daily snapshots of the
 *   portfolio, in any order.
 * @param dateRange - The selected window. Days fall back to
 *   the earliest and latest snapshot when omitted.
 *
 * @returns The chart models, in render order.
 *
 * @example
 * const MODELS = BuildPortfolioCharts(PERFORMANCES, DATE_RANGE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioCharts(
  performances: readonly PortfolioPerformanceResponseDTO[],
  dateRange: DateRange | undefined
): EntityChartModel[] {
  const WINDOW = ResolvePeriodWindow(
    performances,
    dateRange?.from ?? null,
    dateRange?.to ?? null
  )

  if (WINDOW.inWindow.length === 0) return []

  return [
    BuildPatrimonyChart(WINDOW.inWindow, WINDOW.opening),
    BuildReturnChart(WINDOW.inWindow),
    BuildResultChart(WINDOW.inWindow),
    BuildMovementChart(WINDOW.inWindow),
  ]
}
