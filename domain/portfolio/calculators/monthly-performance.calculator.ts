import Decimal from "decimal.js"

import { ToMonthKey } from "@/lib/date/month-key"
import { SeriesGrowthFactors } from "@/lib/performance/period-window.calculator"
import { calculatePortfolioReturn } from "@/domain/portfolio/calculators/return.calculator"

export interface MonthlyPerformanceSnapshot {
  // Snapshot day, as an ISO 8601 string.
  date: string
  // Return of the day, in percent, as a decimal string. Kept
  // for the display fallback of a single-day month, never
  // chained, because its two-decimal rounding would compound.
  returnDaily: string
  // Trailing return of the month, used as a fallback when
  // the month holds a single snapshot.
  returnMonthly: string | null
  // Monthly target of the snapshot, or `null` when the
  // target could not be resolved.
  target: string | null
  // Market gain of the day, as a decimal string.
  earnings: string
  // Closing value of the day, as a decimal string.
  patrimony: string
  // Net cash flow of the day, as a decimal string. Rebuilds
  // the exact daily growth factor together with `patrimony`
  // and `earnings`, so the month chains without rounding.
  cashFlowNet: string
  // Money applied on the day, as a decimal string.
  applicationTotal: string
  // Money redeemed on the day, as a decimal string.
  redemptionTotal: string
}

export interface MonthlyPerformanceRow {
  // The `YYYY-MM` key of the month.
  month: string
  // Chained return of the month, or `null` when the month
  // holds no snapshot.
  returnMonthly: string | null
  // Monthly target of the month, or `null`.
  target: string | null
  // Sum of the earnings of the month.
  earnings: string
  // Closing patrimony of the month, or `null` when the
  // month holds no snapshot.
  patrimony: string | null
  // Sum of the applications of the month.
  applications: string
  // Sum of the redemptions of the month.
  withdrawals: string
}

// Parses a decimal string to a finite amount, defaulting to
// zero, so a malformed field never poisons the month sums.
function ToAmount(value: string | null | undefined): string {
  if (value === null || value === undefined) return "0"
  return Number.isFinite(Number.parseFloat(value)) ? value : "0"
}

/**
 * @summary
 * Aggregates daily performance snapshots into one row per
 * month.
 *
 * @remarks
 * Groups the snapshots by UTC month, chains the daily
 * returns of each group into a month return and sums the
 * earnings, the applications and the redemptions of the
 * group. The closing patrimony and the target are the
 * values of the last snapshot of the month. A month with a
 * single snapshot falls back to its stored month return.
 * The rows follow the provided month keys, so a month with
 * no snapshot still renders as a null row instead of
 * shifting the axis.
 *
 * @explanation
 * Use this calculator to feed the month series of the
 * statement report: the performance chart, the earnings
 * chart, the patrimony table and the movements table all
 * read the same rows.
 *
 * @param snapshots - The daily snapshots, in any order.
 * @param months - The `YYYY-MM` keys to resolve, in order.
 *
 * @returns One row per requested month, in order.
 *
 * @example
 * const ROWS = calculateMonthlyPerformance(SNAPSHOTS, [
 *   "2026-01",
 *   "2026-02",
 * ]);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-06
 */
export function calculateMonthlyPerformance(
  snapshots: readonly MonthlyPerformanceSnapshot[],
  months: readonly string[]
): MonthlyPerformanceRow[] {
  const BY_MONTH = new Map<
    string,
    MonthlyPerformanceSnapshot[]
  >()

  for (const SNAPSHOT of snapshots) {
    const KEY = ToMonthKey(SNAPSHOT.date)
    const GROUP = BY_MONTH.get(KEY) ?? []
    GROUP.push(SNAPSHOT)
    BY_MONTH.set(KEY, GROUP)
  }

  return months.map((month) => {
    const GROUP = (BY_MONTH.get(month) ?? [])
      .slice()
      .sort((left, right) => left.date.localeCompare(right.date))

    if (GROUP.length === 0) {
      return {
        month,
        returnMonthly: null,
        target: null,
        earnings: "0.00",
        patrimony: null,
        applications: "0.00",
        withdrawals: "0.00",
      }
    }

    const LAST = GROUP[GROUP.length - 1]

    // The month return is chained from the exact daily growth
    // factors rebuilt from the balances, never from the
    // two-decimal `returnDaily`, whose rounding would compound
    // over the days and drift the month away from the
    // statement. A single-snapshot month falls back to the
    // stored month return, which the performance calculation
    // already resolved.
    const RETURN =
      GROUP.length >= 2
        ? calculatePortfolioReturn({
            dailyGrowthFactors: SeriesGrowthFactors(
              GROUP.map((snapshot) => ({
                date: snapshot.date,
                patrimony: snapshot.patrimony,
                earnings: snapshot.earnings,
                cashFlowNet: snapshot.cashFlowNet,
                returnDaily: snapshot.returnDaily,
                returnMonthly: snapshot.returnMonthly,
                returnYearly: null,
              }))
            ),
          }).value.toFixed(2)
        : LAST.returnMonthly

    const EARNINGS = GROUP.reduce(
      (sum, snapshot) => sum.plus(ToAmount(snapshot.earnings)),
      new Decimal(0)
    )
    const APPLICATIONS = GROUP.reduce(
      (sum, snapshot) =>
        sum.plus(ToAmount(snapshot.applicationTotal)),
      new Decimal(0)
    )
    const WITHDRAWALS = GROUP.reduce(
      (sum, snapshot) =>
        sum.plus(ToAmount(snapshot.redemptionTotal)),
      new Decimal(0)
    )

    return {
      month,
      returnMonthly: RETURN,
      target: LAST.target,
      earnings: EARNINGS.toFixed(2),
      patrimony: LAST.patrimony,
      applications: APPLICATIONS.toFixed(2),
      withdrawals: WITHDRAWALS.toFixed(2),
    }
  })
}
