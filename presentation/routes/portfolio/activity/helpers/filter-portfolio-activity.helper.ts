import type { DateRange } from "react-day-picker"

import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

/**
 * @summary
 * Filters the activity rows of a portfolio to a window.
 *
 * @remarks
 * A row is kept when its UTC day key falls inside the
 * inclusive `[from, to]` range of the window. The keys derive
 * from the picked dates through the same local-midnight round
 * trip the date range filter uses for its calendar days, so a
 * movement can never appear outside the window its own day
 * enables.
 *
 * An undefined window keeps every row, which is what renders
 * while the range has not been picked or the portfolio has no
 * snapshots to derive one from.
 *
 * @explanation
 * Use this helper from the overview hook, over the rows the
 * loader already resolved. Filtering here instead of at the
 * database keeps re-picking the dates instant, because the
 * movements of a portfolio are a small list that stays loaded
 * for the life of the screen.
 *
 * @param rows - The activity rows of the portfolio, newest
 *   first.
 * @param range - The selected window, or `undefined`.
 *
 * @returns The rows inside the window, or every row when no
 *   window is selected.
 *
 * @example
 * const ROWS = FilterPortfolioActivity(ACTIVITY, DATE_RANGE);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function FilterPortfolioActivity(
  rows: readonly PortfolioActivityRow[],
  range: DateRange | undefined
): PortfolioActivityRow[] {
  const FROM = range?.from
    ? range.from.toISOString().slice(0, 10)
    : undefined
  const TO = range?.to
    ? range.to.toISOString().slice(0, 10)
    : undefined

  if (!FROM || !TO) return [...rows]

  return rows.filter((row) => {
    const KEY = row.date.slice(0, 10)
    return KEY >= FROM && KEY <= TO
  })
}