"use client"

import { FormatCount } from "@/presentation/presenters/count.presenter"

import { PORTFOLIO_PERFORMANCE_CALCULATE } from "../settings/labels.settings"
import type { PortfolioPerformanceCalculationProgress } from "../types/portfolio-performance-list.types"

/**
 * @summary
 * Resolves the figures a calculation progress dialog reports.
 *
 * @remarks
 * The snapshot counts portfolios and days separately, but the
 * work is the product of the two: every portfolio owes a figure
 * for every day in the window. Turning that product into the
 * two numbers the bar needs is arithmetic, not rendering, so it
 * belongs here rather than in the dialog body.
 *
 * Skipped units still advanced the run, so the bar counts them.
 * They are only broken out in the finished summary, and only
 * when there were any: a caveat with nothing to caveat is
 * noise.
 *
 * @explanation
 * Use in `PortfolioPerformanceCalculateProgressDialog`. Call it
 * once with the polled snapshot.
 *
 * @param job - The polled job snapshot, or null.
 *
 * @returns The processed and total units, the finished
 *   summary, and the skipped caveat when there is one.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function usePortfolioPerformanceProgress(
  job: PortfolioPerformanceCalculationProgress | null
) {
  const done = job ? job.calculated + job.skipped : 0
  const total = job ? job.portfolioCount * job.daysTotal : 0

  const summary = [
    {
      value: FormatCount(job?.calculated ?? 0),
      label: PORTFOLIO_PERFORMANCE_CALCULATE.CALCULATED_LABEL,
    },
    {
      value: FormatCount(job?.portfolioCount ?? 0),
      label: PORTFOLIO_PERFORMANCE_CALCULATE.PORTFOLIOS_LABEL,
    },
  ]

  const warning =
    job && job.skipped > 0
      ? `${FormatCount(job.skipped)} ${
          PORTFOLIO_PERFORMANCE_CALCULATE.SKIPPED_LABEL
        }`
      : null

  return { done, total, summary, warning }
}

export { usePortfolioPerformanceProgress }
