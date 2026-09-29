import type { ChartConfig } from "@/presentation/ui/chart"

import type { EntityChartSeries } from "./types"

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
const SIGN_NEGATIVE_COLOR = "var(--color-negative)"

/**
 * @summary
 * Resolves the color of a series from its render order.
 *
 * @remarks
 * Cycles the `--chart-*` ramp, so the first series of every
 * chart shares the primary color regardless of the key. A
 * `sign` tone series keeps this identity color for its
 * legend swatch and only recolors its columns, so the
 * legend stays readable next to a two-color bar.
 *
 * @param index - Zero-based render order of the series.
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
export function ResolveSeriesColor(index: number): string {
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
      color: ResolveSeriesColor(index),
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
 * a loss. A series without the `sign` tone always takes its
 * identity color.
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
  if (series.tone !== "sign" || value === null) {
    return ResolveSeriesColor(index)
  }

  return value < 0 ? SIGN_NEGATIVE_COLOR : SIGN_POSITIVE_COLOR
}
