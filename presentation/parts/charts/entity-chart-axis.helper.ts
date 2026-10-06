import type {
  EntityChartPoint,
  EntityChartSeries,
} from "./entity-chart.types"

// Width of a value axis, in pixels, when the series have no
// formatter to measure.
const DEFAULT_VALUE_AXIS_WIDTH = 56

// Width of a category axis holding no label at all.
const DEFAULT_CATEGORY_AXIS_WIDTH = 160

// Bounds of a width derived from the longest label it has to
// hold. A wider axis would waste plot area, and a narrower one
// would clip the label it was sized for.
const MIN_AXIS_WIDTH = 48
const MAX_VALUE_AXIS_WIDTH = 132
const MAX_CATEGORY_AXIS_WIDTH = 220

// Approximate width, in pixels, of one character of an axis
// label at the axis font size.
const AXIS_CHARACTER_WIDTH = 7

// Gap, in pixels, reserved between the widest label and the
// plot area, so the last character is not flush to the grid.
const AXIS_LABEL_PADDING = 12

/**
 * Clamps a measured label width into the axis bounds.
 *
 * @param characters - Length of the longest label, or `0`
 *   when there is no label to measure.
 * @param fallback - Width used when nothing is measured.
 * @param max - Upper bound of the axis.
 *
 * @returns The axis width, in pixels.
 */
function ToAxisWidth(
  characters: number,
  fallback: number,
  max: number
): number {
  if (characters === 0) return fallback

  return Math.min(
    Math.max(
      characters * AXIS_CHARACTER_WIDTH + AXIS_LABEL_PADDING,
      MIN_AXIS_WIDTH
    ),
    max
  )
}

/**
 * @summary
 * Derives the width of a value axis from its tick labels.
 *
 * @remarks
 * Measures the longest label the first series can produce
 * over the plotted values, so a currency axis is not clipped
 * and a percentage axis is not padded. Falls back to the
 * default width when the series exposes no formatter or the
 * first series never plots a value.
 *
 * @param series - The first series of the chart, which owns
 *   the axis labels.
 * @param points - The points of the chart.
 *
 * @returns The axis width, in pixels.
 *
 * @example
 * const WIDTH = ResolveValueAxisWidth(SERIES[0], POINTS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function ResolveValueAxisWidth(
  series: EntityChartSeries | undefined,
  points: readonly EntityChartPoint[]
): number {
  const FORMAT = series?.formatTick ?? series?.formatValue
  if (!series || !FORMAT) return DEFAULT_VALUE_AXIS_WIDTH

  const LONGEST = points.reduce((longest, point) => {
    const VALUE = point.values[series.key]
    if (VALUE === null || VALUE === undefined) return longest
    return Math.max(longest, FORMAT(VALUE).length)
  }, 0)

  return ToAxisWidth(
    LONGEST,
    DEFAULT_VALUE_AXIS_WIDTH,
    MAX_VALUE_AXIS_WIDTH
  )
}

/**
 * @summary
 * Derives the width of a category axis from its labels.
 *
 * @remarks
 * The mirror of `ResolveValueAxisWidth` for the axis that
 * carries the category names rather than the numbers. A
 * horizontal chart measures the longest name its points
 * declare, so a norm called "Resolução CMN 4.993" keeps its
 * full label instead of being truncated to whatever room the
 * tick formatter of a currency series happened to leave.
 *
 * @param points - The points of the chart, whose labels are
 *   the categories of the axis.
 *
 * @returns The axis width, in pixels.
 *
 * @example
 * const WIDTH = ResolveCategoryAxisWidth(MODEL.points);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export function ResolveCategoryAxisWidth(
  points: readonly EntityChartPoint[]
): number {
  const LONGEST = points.reduce(
    (longest, point) => Math.max(longest, point.label.length),
    0
  )

  return ToAxisWidth(
    LONGEST,
    DEFAULT_CATEGORY_AXIS_WIDTH,
    MAX_CATEGORY_AXIS_WIDTH
  )
}
