import type { DateRange } from "react-day-picker"

import { BuildPerformanceChartModels } from "@/presentation/parts/charts/entity-performance-chart-models.helper"
import type { EntityChartModel } from "@/presentation/parts/charts/entity-chart.types"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_CHARTS } from "../settings/labels.settings"

/**
 * @summary
 * Builds the charts of the portfolio detail screen.
 *
 * @remarks
 * Delegates to the shared performance chart builder, feeding
 * it the portfolio snapshots, the selected window and the
 * portfolio copy and id scope. Clamps the snapshot series to
 * the selected `[from, to]` window through the shared period
 * window calculator — the same one the KPI cards and the
 * chained returns read — and derives the patrimony, the
 * return, the daily result and the cash movement charts from
 * real registry data. Because every chart and every card is
 * fed by one window, a number a chart shows can never
 * disagree with the card above it. Returns an empty array
 * when the window holds no snapshot, so the screen shows no
 * chart at all instead of an empty frame.
 *
 * @explanation
 * Use this helper from the overview hook. It is pure, so the
 * three models can be asserted without a browser and a chart
 * can be added later by adding one builder and one entry in
 * the shared builder.
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
  return BuildPerformanceChartModels(
    performances,
    dateRange,
    PORTFOLIO_CHARTS,
    "portfolio"
  )
}
