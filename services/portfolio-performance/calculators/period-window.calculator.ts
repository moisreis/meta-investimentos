import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"

// The daily snapshots clamped to a selected window, plus
// the anchors of the year and month horizons that close it.
export interface PortfolioPeriodWindow {
  // The closing snapshot of the window, or `null` when the
  // window holds no snapshot.
  end: PortfolioPerformanceResponseDTO | null
  // The last snapshot before the window opens, used as the
  // comparison baseline of the patrimony card.
  opening: PortfolioPerformanceResponseDTO | null
  // Snapshots inside the window, ascending by date.
  inWindow: PortfolioPerformanceResponseDTO[]
  // Snapshots inside the window from the year anchor on.
  yearSeries: PortfolioPerformanceResponseDTO[]
  // Snapshots inside the window from the month anchor on.
  monthSeries: PortfolioPerformanceResponseDTO[]
  // Start of the calendar year, in UTC millis.
  yearStart: number
  // Start of the calendar month, in UTC millis.
  monthStart: number
  // Effective start of the year horizon, in UTC millis.
  yearAnchor: number
  // Effective start of the month horizon, in UTC millis.
  monthAnchor: number
}

// Parses a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Starts the UTC day of the provided date, in millis.
function StartOfUtcDay(date: Date): number {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )
}

// Ends the UTC day of the provided date, in millis.
function EndOfUtcDay(date: Date): number {
  return StartOfUtcDay(date) + 86_400_000 - 1
}

// Millis at which a snapshot was recorded.
function TimeOf(
  snapshot: PortfolioPerformanceResponseDTO
): number {
  return new Date(snapshot.date).getTime()
}

/**
 * @summary
 * Clamps a performance series to a window and derives the
 * year and month horizons that close it.
 *
 * @remarks
 * Sorts the series by date, keeps the snapshots inside the
 * inclusive `[from, to]` window and resolves the snapshot
 * immediately before the window opens as the comparison
 * baseline. The year and month horizons start at the
 * calendar year and calendar month of the closing snapshot,
 * never before the window opens, so a narrow selection can
 * never report a gain earned outside it. Boundaries follow
 * the UTC day key convention of the registry filters.
 *
 * @explanation
 * Use this calculator to agree on which snapshots feed a
 * horizon. The use case chains the returns through it, and
 * the KPI cards read the same window, so the labels and the
 * values can never drift apart.
 *
 * @param performances - The daily snapshots, in any order.
 * @param from - The inclusive start of the window. Falls
 *   back to the earliest snapshot when `null`.
 * @param to - The inclusive end of the window. Falls back
 *   to the latest snapshot when `null`.
 *
 * @returns The clamped window and its horizon anchors.
 *
 * @example
 * const WINDOW = ResolvePeriodWindow(PERFORMANCES, FROM, TO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ResolvePeriodWindow(
  performances: readonly PortfolioPerformanceResponseDTO[],
  from: Date | null,
  to: Date | null
): PortfolioPeriodWindow {
  const SNAPSHOTS = [...performances].sort((left, right) =>
    left.date.localeCompare(right.date)
  )

  const FIRST_TIME =
    SNAPSHOTS.length > 0 ? TimeOf(SNAPSHOTS[0]) : 0
  const LAST_TIME =
    SNAPSHOTS.length > 0
      ? TimeOf(SNAPSHOTS[SNAPSHOTS.length - 1])
      : 0

  const FROM_TIME = from ? StartOfUtcDay(from) : FIRST_TIME
  const TO_TIME = to ? EndOfUtcDay(to) : LAST_TIME

  const IN_WINDOW = SNAPSHOTS.filter((snapshot) => {
    const TIME = TimeOf(snapshot)
    return TIME >= FROM_TIME && TIME <= TO_TIME
  })

  const END = IN_WINDOW[IN_WINDOW.length - 1] ?? null

  let OPENING: PortfolioPerformanceResponseDTO | null = null
  for (
    let INDEX = SNAPSHOTS.length - 1;
    INDEX >= 0;
    INDEX -= 1
  ) {
    if (TimeOf(SNAPSHOTS[INDEX]) < FROM_TIME) {
      OPENING = SNAPSHOTS[INDEX]
      break
    }
  }

  const END_DATE = END ? new Date(END.date) : null
  const END_YEAR = END_DATE?.getUTCFullYear() ?? 0
  const END_MONTH = END_DATE?.getUTCMonth() ?? 0

  const YEAR_START = Date.UTC(END_YEAR, 0, 1)
  const MONTH_START = Date.UTC(END_YEAR, END_MONTH, 1)

  const YEAR_ANCHOR = Math.max(FROM_TIME, YEAR_START)
  const MONTH_ANCHOR = Math.max(FROM_TIME, MONTH_START)

  return {
    end: END,
    opening: OPENING,
    inWindow: IN_WINDOW,
    yearSeries: IN_WINDOW.filter(
      (snapshot) => TimeOf(snapshot) >= YEAR_ANCHOR
    ),
    monthSeries: IN_WINDOW.filter(
      (snapshot) => TimeOf(snapshot) >= MONTH_ANCHOR
    ),
    yearStart: YEAR_START,
    monthStart: MONTH_START,
    yearAnchor: YEAR_ANCHOR,
    monthAnchor: MONTH_ANCHOR,
  }
}

/**
 * @summary
 * Sums the daily earnings of a series.
 *
 * @remarks
 * Adds the `earnings` field of each snapshot as a finite
 * amount, so an empty series sums to zero.
 *
 * @explanation
 * Use this calculator to accumulate the gain of a horizon
 * from the snapshots the window resolved.
 *
 * @param series - The snapshots of the horizon.
 *
 * @returns The accumulated earnings.
 *
 * @example
 * const GAIN = SumSeriesEarnings(WINDOW.yearSeries);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function SumSeriesEarnings(
  series: readonly PortfolioPerformanceResponseDTO[]
): number {
  return series.reduce(
    (sum, snapshot) => sum + ToAmount(snapshot.earnings),
    0
  )
}
