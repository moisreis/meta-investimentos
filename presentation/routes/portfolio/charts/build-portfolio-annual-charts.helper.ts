import { BuildAnnualChartModels } from "@/presentation/parts/charts/annual-chart-models.helper"
import type { EntityChartModel } from "@/presentation/parts/charts/types"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_ANNUAL } from "../settings/labels.settings"

/**
 * @summary
 * Builds the annual monthly charts of the portfolio detail
 * screen.
 *
 * @remarks
 * Delegates to the shared annual chart builder, feeding it
 * the portfolio snapshots, the current UTC year and the
 * portfolio copy and id scope. Derives the monthly earnings,
 * patrimony and return of a calendar year from the daily
 * snapshots of the portfolio. Every chart plots the same
 * twelve month slots — from January to December — so the
 * months of the year line up across the three charts, and a
 * month without a snapshot keeps a gap on every one of them.
 * The three charts are independent of the selected window:
 * the year is a fixed horizon, so narrowing the date range
 * must not change what a month of the year reports.
 *
 * Returns an empty array when the year holds no snapshot, so
 * the screen shows no annual section at all instead of a row
 * of empty frames.
 *
 * @explanation
 * Use this helper from the overview hook, passing the current
 * UTC year. It is pure, so the models can be asserted without
 * a browser and a monthly chart can be added later by adding
 * one builder and one entry in the shared builder.
 *
 * @param performances - The daily snapshots of the
 *   portfolio, in any order.
 * @param year - The calendar year the charts describe.
 *
 * @returns The annual chart models, in render order.
 *
 * @example
 * const MODELS = BuildPortfolioAnnualCharts(PERFORMANCES, YEAR);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioAnnualCharts(
  performances: readonly PortfolioPerformanceResponseDTO[],
  year: number
): EntityChartModel[] {
  return BuildAnnualChartModels(
    performances,
    year,
    PORTFOLIO_ANNUAL,
    "portfolio"
  )
}