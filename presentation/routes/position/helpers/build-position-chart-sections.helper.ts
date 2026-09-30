import type { DateRange } from "react-day-picker"

import { BuildAnnualChartModels } from "@/presentation/parts/charts/annual-chart-models.helper"
import type { EntityChartSection } from "@/presentation/parts/charts/entity-chart-section.types"
import { BuildPerformanceChartModels } from "@/presentation/parts/charts/performance-chart-models.helper"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

import {
  POSITION_ANNUAL,
  POSITION_CHARTS,
  POSITION_CHART_SECTIONS,
} from "../settings/labels.settings"

/**
 * Inputs of the position chart sections builder.
 */
export interface BuildPositionChartSectionsInput {
  // Daily snapshots of the position, feeding the windowed
  // performance charts and the annual monthly charts.
  performances: readonly PositionPerformanceResponseDTO[]
  // The selected window, which clamps the performance charts.
  dateRange: DateRange | undefined
  // The calendar year the annual monthly charts describe.
  year: number
}

/**
 * @summary
 * Builds the chart sections of the position detail screen.
 *
 * @remarks
 * Groups the charts into their titled sections: the windowed
 * performance and the annual monthly history. The performance
 * section features its patrimony chart full width, because it
 * is the headline of the screen. A section whose models are
 * empty is dropped, so neither an empty ring nor an empty
 * frame is ever rendered, and the sections read in render
 * order.
 *
 * @explanation
 * Use this helper from the overview hook. It is a pure
 * composition point: every chart is built by the shared part
 * builders, so the section titles and the render order live
 * next to the charts they order.
 *
 * @param input - The records and the window the charts are
 *   derived from.
 *
 * @returns The chart sections, in render order.
 *
 * @example
 * const SECTIONS = BuildPositionChartSections({
 *   performances,
 *   dateRange,
 *   year,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export function BuildPositionChartSections(
  input: BuildPositionChartSectionsInput
): EntityChartSection[] {
  const SECTIONS: EntityChartSection[] = [
    {
      id: "performance",
      title: POSITION_CHART_SECTIONS.PERFORMANCE_TITLE,
      featured: true,
      models: BuildPerformanceChartModels(
        input.performances,
        input.dateRange,
        POSITION_CHARTS,
        "position"
      ),
    },
    {
      id: "annual",
      title: POSITION_CHART_SECTIONS.ANNUAL_TITLE,
      models: BuildAnnualChartModels(
        input.performances,
        input.year,
        POSITION_ANNUAL,
        "position"
      ),
    },
  ]

  return SECTIONS.filter((section) => section.models.length > 0)
}
