import Decimal from "decimal.js"

import { ToMonthKey } from "@/lib/date/month-key"

/**
 * One monthly reading of a benchmark series.
 */
export interface BenchmarkRateEntry {
  // Date of the monthly reading, as an ISO 8601 string.
  date: string
  // Rate of the reading, in percent, as a decimal
  // string (`0.45` means `0.45%`).
  rate: string
}

export interface BenchmarkMonthlyRateRow {
  // The `YYYY-MM` key of the month.
  month: string
  // Monthly rate of the benchmark, or `null` when the
  // month holds no reading.
  rate: string | null
}

/**
 * @summary
 * Resolves the monthly rate of a benchmark for each month
 * of a series.
 *
 * @remarks
 * Buckets every reading into the calendar month of its own
 * date and takes the latest reading of each month. A reading
 * never spills into a later month, so a sparse registry
 * cannot compound the same figure several times. The result
 * follows the order of the requested months, so a month
 * without a reading stays `null` instead of shifting the
 * axis.
 *
 * @explanation
 * Use this calculator to feed the index series of the
 * statement report: the accumulated indices and the
 * indices-by-month table both read these rows.
 *
 * @param props - The readings and the month keys.
 *
 * @returns One row per requested month, in order.
 *
 * @example
 * const ROWS = calculateBenchmarkMonthlyRates({
 *   entries: [
 *     { date: "2026-07-01T00:00:00.000Z", rate: "0.52" },
 *   ],
 *   months: ["2026-07", "2026-08"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function calculateBenchmarkMonthlyRates(props: {
  entries: readonly BenchmarkRateEntry[]
  months: readonly string[]
}): BenchmarkMonthlyRateRow[] {
  const LATEST_BY_MONTH = new Map<string, BenchmarkRateEntry>()

  for (const ENTRY of props.entries) {
    const MONTH = ToMonthKey(ENTRY.date)
    const CURRENT = LATEST_BY_MONTH.get(MONTH)
    if (CURRENT === undefined || ENTRY.date >= CURRENT.date) {
      LATEST_BY_MONTH.set(MONTH, ENTRY)
    }
  }

  return props.months.map((month) => ({
    month,
    rate: LATEST_BY_MONTH.get(month)?.rate ?? null,
  }))
}

/**
 * @summary
 * Chains a series of monthly rates into an accumulated
 * rate.
 *
 * @remarks
 * Compounds the monthly factors in order and ignores the
 * months without a reading. Returns `null` when no month
 * holds a reading, so an unregistered index never resolves
 * to a fabricated zero.
 *
 * @explanation
 * Use this calculator to resolve the accumulated figure of
 * a benchmark for the statement's accumulated indices
 * section.
 *
 * @param rates - The monthly rates, in percent, in order.
 *
 * @returns The accumulated rate, or `null`.
 *
 * @example
 * accumulateBenchmarkRates(["1.00", "2.00"]); // "3.02"
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function accumulateBenchmarkRates(
  rates: readonly (string | null)[]
): string | null {
  const PRESENT = rates.filter(
    (rate): rate is string => rate !== null
  )

  if (PRESENT.length === 0) return null

  const FACTOR = PRESENT.reduce(
    (factor, rate) =>
      factor.times(
        new Decimal(1).plus(new Decimal(rate).dividedBy(100))
      ),
    new Decimal(1)
  )

  return FACTOR.minus(1).times(100).toFixed(2)
}
