import type { SignedPercentage } from "@/value-objects"

// One recorded reading of the inflation index.
export interface MonthlyInflationEntry {
  date: Date
  rate: SignedPercentage
}

interface CalculateMonthlyInflationRatesProps {
  entries: readonly MonthlyInflationEntry[]
  targetDate: Date
}

export interface MonthlyInflationRates {
  // The index of January through the target month, in
  // order. `null` when no reading exists on or before
  // that month.
  rates: (SignedPercentage | null)[]
}

/**
 * @summary
 * Resolves the monthly inflation index of a year.
 *
 * @remarks
 * Inflation is published after the month it measures, and
 * an operator records it whenever it becomes known, so a
 * month is often still missing when a snapshot is
 * calculated. The most recent reading on or before a month
 * therefore stands in for it. Months that precede every
 * reading stay `null`: nothing can stand in for a reading
 * that was never recorded.
 *
 * @explanation
 * Reads the entries as a series rather than as a lookup,
 * because the caller needs January through the target month
 * in one pass: the target takes the last value, and the
 * accumulated target chains the whole run.
 *
 * @param props - The recorded readings and the date whose
 *   year is being resolved.
 *
 * @returns The index of each month from January to the
 *   target month, in order.
 *
 * @example
 * const { rates: RATES } = calculateMonthlyInflationRates({
 *   entries: [
 *     { date: new Date("2026-01-01"), rate: SIGNED },
 *   ],
 *   targetDate: new Date("2026-03-15"),
 * });
 * // RATES is [JANUARY, JANUARY, JANUARY].
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function calculateMonthlyInflationRates(
  props: CalculateMonthlyInflationRatesProps
): MonthlyInflationRates {
  const ORDERED = [...props.entries].sort(
    (left, right) => left.date.getTime() - right.date.getTime()
  )

  const RATES: (SignedPercentage | null)[] = []
  const TARGET_MONTH = props.targetDate.getUTCMonth()

  let CURSOR = 0
  let LAST: SignedPercentage | null = null

  for (let MONTH = 0; MONTH <= TARGET_MONTH; MONTH += 1) {
    // Month 12 overflows into January of the next year,
    // which is the bound the December window wants.
    const WINDOW_END = new Date(
      Date.UTC(props.targetDate.getUTCFullYear(), MONTH + 1, 1)
    )

    while (
      CURSOR < ORDERED.length &&
      ORDERED[CURSOR].date.getTime() < WINDOW_END.getTime()
    ) {
      LAST = ORDERED[CURSOR].rate
      CURSOR += 1
    }

    RATES.push(LAST)
  }

  return { rates: RATES }
}
