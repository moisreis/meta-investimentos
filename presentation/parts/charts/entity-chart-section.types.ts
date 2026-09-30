import type { EntityChartModel } from "@/presentation/parts/charts/types"

/**
 * @summary
 * A titled group of charts of an entity detail screen,
 * rendered in read order.
 *
 * @remarks
 * The section decorates its own models: it owns the title,
 * which model spans the full width (the featured one) and
 * the render order. Because the type is structural, the
 * route-owned section types of the portfolio and of the
 * position satisfy it unchanged.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-29
 */
export interface EntityChartSection {
  // Stable id of the section, used as the React key and as
  // the `aria-labelledby` anchor of its title.
  id: string
  // Sentence case title, rendered above the charts.
  title: string
  // Spans the first model of the section across the full
  // width of the screen. Omitted for the sections whose
  // charts all share the same grid.
  featured?: boolean
  // The chart models of the section, in render order.
  models: readonly EntityChartModel[]
}