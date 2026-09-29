import type { EntityChartModel } from "@/presentation/parts/charts/types"

/**
 * @summary
 * A titled group of charts of the portfolio detail screen.
 *
 * @remarks
 * A section groups the charts that share a meaning — the
 * windowed performance, the holdings distribution, the
 * checking accounts, the annual monthly history — under one
 * title, so the screen reads in blocks instead of in a flat
 * list. Each chart carries its own description inside its
 * card, so the section states only what the group is. The
 * models inside a section are rendered in order; a section
 * with no model is dropped by the builder, never rendered as
 * an empty frame.
 *
 * @explanation
 * Use this type between the overview hook and the charts
 * component of the portfolio detail screen.
 * `BuildPortfolioChartSections` is the only producer, so
 * title and render order stay next to the chart builders.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface PortfolioChartSection {
  // Stable id of the section, used as the key and as the
  // heading anchor.
  id: string
  // Section title, rendered as the heading.
  title: string
  // When `true`, the first model spans the full width of the
  // section and the remaining ones lay out in the grid, so a
  // headline chart — such as the period patrimony — reads
  // first.
  featured?: boolean
  // The charts of the section, in render order.
  models: readonly EntityChartModel[]
}
