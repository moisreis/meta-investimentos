import type { ChartConfig } from "@/presentation/ui/chart"

import type { EntityChartSeries } from "./entity-chart.types"

// Series colors cycled in declaration order. The tokens
// follow the `--chart-*` ramp of the theme, so a chart
// re-colors with the rest of the app and needs no inline
// color of its own.
const SERIES_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const

// Column colors of a `sign` tone series, resolved from the
// theme so a gain, a loss, a headline figure and a ledger row
// all read as the same two colors on light and on dark.
const SIGN_POSITIVE_COLOR = "var(--color-positive)"

// The red this chart system paints with, resolved from the
// theme. Exported because a route may want a series to wear it
// deliberately, not because its value went negative: the token
// is the only definition of "the data red", so a route reusing
// it stays on the same one the sign tone uses.
export const ENTITY_CHART_NEGATIVE_COLOR =
  "var(--color-negative)"

/**
 * @summary
 * Resolves the color of a series from its render order.
 *
 * @remarks
 * Cycles the `--chart-*` ramp, so the first series of every
 * chart shares the primary color regardless of the key. A
 * series that names its own color keeps it instead, which is
 * what stops a chart with more series than the ramp has steps
 * from painting two of them the same. A `sign` tone series
 * keeps this identity color for its
 * legend swatch and only recolors its columns, so the
 * legend stays readable next to a two-color bar.
 *
 * @param index - Zero-based render order of the series.
 * @param series - The series owning the color, when it states
 *   one.
 *
 * @returns The CSS color of the series.
 *
 * @example
 * const COLOR = ResolveSeriesColor(0);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ResolveSeriesColor(
  index: number,
  series?: EntityChartSeries
): string {
  if (series?.color !== undefined) return series.color

  return SERIES_COLORS[index % SERIES_COLORS.length]
}

/**
 * @summary
 * Builds the recharts config of a chart from its series.
 *
 * @remarks
 * The config is what `ChartContainer` injects as the
 * `--color-<key>` custom properties and what resolves the
 * legend and tooltip labels, so the series key is used as
 * the config key and the series label as its text.
 *
 * A series that names its own color contributes it here, which
 * is what keeps its legend swatch on the same color as its
 * column instead of falling back to the ramp.
 *
 * @param series - The series of the chart, in render order.
 *
 * @returns The chart config.
 *
 * @example
 * const CONFIG = BuildChartConfig(MODEL.series);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildChartConfig(
  series: readonly EntityChartSeries[]
): ChartConfig {
  return series.reduce<ChartConfig>((config, item, index) => {
    config[item.key] = {
      label: item.label,
      color: ResolveSeriesColor(index, item),
    }
    return config
  }, {})
}

/**
 * @summary
 * Resolves the color of a single `sign` tone column.
 *
 * @remarks
 * Zero counts as positive, so a flat day is not painted as
 * a loss. A series that names its own color always keeps it,
 * since an explicit color is a decision and a sign tone is a
 * default. A series without either takes its identity color.
 *
 * @param series - The series owning the column.
 * @param index - Zero-based render order of the series.
 * @param value - Value of the column, or `null` for a gap.
 *
 * @returns The CSS color of the column.
 *
 * @example
 * const FILL = ResolveColumnFill(SERIES, 0, -120.5);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ResolveColumnFill(
  series: EntityChartSeries,
  index: number,
  value: number | null
): string {
  if (series.color !== undefined) return series.color

  if (series.tone !== "sign" || value === null) {
    return ResolveSeriesColor(index)
  }

  return value < 0
    ? ENTITY_CHART_NEGATIVE_COLOR
    : SIGN_POSITIVE_COLOR
}
