/**
 * @summary
 * The text tone of a figure of the statement PDF.
 */
export type StatementReportTone =
  "neutral" | "positive" | "negative"

/**
 * The text class of each figure tone.
 */
export const STATEMENT_REPORT_TONE: Record<
  StatementReportTone,
  string
> = {
  neutral: "text-foreground",
  positive: "text-positive",
  negative: "text-negative",
}

/**
 * Picks the tone of a signed amount figure.
 */
export function ResultTone(value: string): StatementReportTone {
  const AMOUNT = Number.parseFloat(value)
  if (AMOUNT > 0) return "positive"
  if (AMOUNT < 0) return "negative"
  return "neutral"
}

/**
 * Picks the text tone of a signed percentage figure.
 */
export function ReturnTone(value: string): string {
  return Number.parseFloat(value) < 0
    ? "text-negative"
    : "text-positive"
}
