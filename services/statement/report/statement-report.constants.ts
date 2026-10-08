/**
 * @summary
 * The canonical acronyms of the reference indexes the
 * institutional report tracks.
 *
 * @remarks
 * Every acronym is matched against the registry with
 * `NormalizeAcronym`, so `IMA-Geral`, `IMA GERAL` and
 * `imagerl` resolve to the same reading. A missing index
 * stays out of the report instead of rendering a blank
 * column.
 *
 * @explanation
 * Use these acronyms to resolve the comparison chart of
 * the dashboard, the indices-by-month table and the
 * accumulated indices section.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export const STATEMENT_REPORT_INDEX_ACRONYMS = {
  ipca: "IPCA",
  cdi: "CDI",
  imaGeral: "IMA-GERAL",
  ibovespa: "IBOVESPA",
  irfM: "IRF-M",
  irfM1: "IRF-M1",
  imaB: "IMA-B",
  imaB5: "IMA-B5",
} as const

/**
 * @summary
 * The indexes the dashboard compares the portfolio
 * against, in display order.
 */
export const STATEMENT_REPORT_COMPARISON_ACRONYMS = [
  "CDI",
  "IPCA",
  "IMA-GERAL",
] as const

/**
 * @summary
 * The short Portuguese labels of the twelve months, from
 * January to December.
 */
export const STATEMENT_REPORT_MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const

/**
 * @summary
 * The categorical palette of the report charts.
 *
 * @remarks
 * Tints of the three brand colors (green, blue and
 * purple), repeated in order when a chart holds more
 * slices than colors. Each group of a distribution,
 * index figure or asset type takes the color at its own
 * position, so the same figure keeps the same tone across
 * the document.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export const STATEMENT_REPORT_SERIES_COLORS = [
  "#007149",
  "#1d4ed8",
  "#6d28d9",
  "#0ea5e9",
  "#7c3aed",
  "#059669",
  "#2563eb",
  "#9333ea",
  "#0891b2",
  "#4f46e5",
  "#047857",
  "#a21caf",
] as const
