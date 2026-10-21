import { STATEMENT_REPORT_PALETTE } from "./shared-statement-report.settings"

/**
 * @summary
 * The single source of the chart label styles of the report.
 *
 * @remarks
 * Every chart draws its text from one of three roles, so the
 * numeric readings, the category names and the legends stay
 * visually identical no matter which chart renders them.
 *
 * The value role carries every figure the reader scans as a
 * number, from the `0%`/`200%` bounds of the gauge to the
 * value at the end of a horizontal bar. The category role
 * carries the name of a bar or a legend entry, such as an
 * index acronym. The legend role carries the axis names and
 * the series captions, such as the months of `Desempenho da
 * Carteira`.
 *
 * The gauge paints inside an `<Svg>`, which reads `fill`,
 * while every other chart is a **react-pdf** `<Text>`, which
 * reads `color`. Both read the color from these objects, so
 * the roles stay in one place.
 *
 * @explanation
 * Use these objects in every chart instead of local font
 * sizes, so a change lands in a single source.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-09
 */
export const STATEMENT_REPORT_CHART_VALUE_STYLE = {
  fontSize: 9,
  color: STATEMENT_REPORT_PALETTE.subdued,
} as const

/**
 * The category label of a chart, such as the name of a bar
 * or the acronym of an index. Heavier than a legend so the
 * row it names stands out.
 */
export const STATEMENT_REPORT_CHART_CATEGORY_STYLE = {
  fontSize: 10,
  fontWeight: 500,
  color: STATEMENT_REPORT_PALETTE.foreground,
} as const

/**
 * The legend label of a chart, such as the months of
 * `Desempenho da Carteira` or the caption of a series
 * swatch.
 */
export const STATEMENT_REPORT_CHART_LEGEND_STYLE = {
  fontSize: 8,
  color: STATEMENT_REPORT_PALETTE.subdued,
} as const
