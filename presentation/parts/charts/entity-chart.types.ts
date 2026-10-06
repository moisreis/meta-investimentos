/**
 * @summary
 * Types shared by the reusable entity chart system.
 *
 * @remarks
 * The chart parts know nothing about any entity. A route
 * turns its own records into an `EntityChartModel` and the
 * charts draw it, so the same card, axis, tooltip and legend
 * serve the portfolio, the position and any other detail
 * screen added later.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */

/**
 * @summary
 * How a chart draws its series.
 *
 * @remarks
 * `area` fills the space under the line, `line` only strokes
 * it, and `bar` draws one column per point. Those three share
 * a category axis, because they plot a series over time or
 * over an ordered dimension. `pie` is the part-to-whole
 * geometry: it draws one slice per point around a ring and
 * has no axis at all, so it can express a share of a whole
 * without inventing an order the data does not have.
 *
 * `horizontal-bar` is the same geometry as `bar` with the
 * axes swapped, so the categories run down the left and the
 * values run across the bottom. It exists because a category
 * label is words and a value label is a number: laid out
 * vertically, a long norm name is truncated on a category
 * axis that has to share its width with the numbers beside
 * it, while laid out horizontally the words get a column of
 * their own and the numbers get the whole width of the card.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export type EntityChartKind =
  "area" | "line" | "bar" | "horizontal-bar" | "pie"

/**
 * @summary
 * A named line, area, bar or slice of a chart.
 *
 * @remarks
 * The key is matched against the values of every point, so
 * it must be stable across renders. `tone: "sign"` colors
 * each column by the sign of its own value, which is what
 * makes a gain or a loss readable at a glance.
 *
 * `color` overrides the palette, which is what lets a chart
 * carry more series than the ramp has steps without two of
 * them sharing a swatch. A series that names a color keeps it
 * everywhere it appears — the column, the legend swatch and
 * the tooltip dot — so the three can never disagree. It wins
 * over `tone`, because a series that states its own color is
 * not asking to be recolored by its own values.
 *
 * A `pie` chart reads only the first series: its points are
 * the slices, so a second series would have no axis and no
 * ring to live on. The first series also owns the total
 * rendered in the center of the ring, formatted by the same
 * `formatValue` the tooltip uses, so the number in the middle
 * can never disagree with the number under the cursor.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface EntityChartSeries {
  // Stable key, matched against the values of every point.
  key: string
  // Label rendered in the legend and in the tooltip.
  label: string
  // Formats a value for the tooltip. Required so a raw
  // number can never reach the browser copy.
  formatValue: (value: number) => string
  // Formats a value for the vertical axis. Falls back to
  // `formatValue`, so a series only compacts its own ticks
  // when the labels would otherwise be too long.
  formatTick?: (value: number) => string
  // When `"sign"`, columns take a positive and a negative
  // color derived from the value of each point.
  tone?: "default" | "sign"
  // Color of the series, overriding the palette ramp. Any CSS
  // color works, so a chart can pair a solid bar with a
  // translucent one that says the same thing more quietly.
  color?: string
}

/**
 * @summary
 * One datum rendered on a chart.
 *
 * @remarks
 * A `null` value renders a gap instead of a zero, which is
 * how a return that does not exist yet stays out of the line
 * instead of dropping the series to the floor.
 *
 * On a `pie` chart the point is a slice instead: the label
 * names the slice and the first series value sizes it.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface EntityChartPoint {
  // Category label on the horizontal axis, the slice name
  // of a pie chart, and the tooltip title.
  label: string
  // Values of the point, keyed by the series key.
  values: Readonly<Record<string, number | null>>
}

/**
 * @summary
 * A horizontal reference line of a chart.
 *
 * @remarks
 * Used to anchor a series to a baseline, such as the
 * patrimony the window opened at, so the reader does not
 * have to remember the previous value.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface EntityChartReference {
  // Value of the horizontal line.
  value: number
  // Label rendered on the line.
  label: string
}

/**
 * @summary
 * A chart resolved by a route and drawn by the chart parts.
 *
 * @remarks
 * The model is the whole contract between a route and the
 * chart system: titles, kind, series, points and reference
 * lines. Building it is a pure function of the entity
 * records, so a chart can be asserted without a browser.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface EntityChartModel {
  // Stable id, also used as the chart container id.
  id: string
  // Card title.
  title: string
  // Optional card description.
  description?: string
  // How the series are drawn.
  kind: EntityChartKind
  // Series drawn by the chart, in render order. The first
  // one takes the primary palette color.
  series: readonly EntityChartSeries[]
  // Points of the chart, in ascending category order. On a
  // pie chart they are the slices, so they read from the
  // biggest share to the smallest.
  points: readonly EntityChartPoint[]
  // Optional horizontal reference lines.
  references?: readonly EntityChartReference[]
  // Caption rendered under the total in the center of a pie
  // chart. Dropped on every other kind, which has no center.
  centerLabel?: string
}
