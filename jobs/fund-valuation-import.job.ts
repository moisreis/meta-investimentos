import "dotenv/config"
import { db } from "@/clients/database.client"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { createCvmClient } from "@/clients/cvm.client"
import {
  ImportFundValuationsUseCase,
  resolveCvmWindow,
} from "@/services/quota/use-cases/import-fund-valuations.use-case"
import type {
  CvmImportWindow,
  ImportMonthInput,
  ImportMonthResult,
  ImportWindowRange,
} from "@/services/quota/use-cases/import-fund-valuations.use-case"

// ---------------------------------
// TYPES
// ---------------------------------

/**
 * A single month inside an import plan.
 */
export interface ImportPlanMonth {
  year: number
  month: number
  start: Date
  end: Date
}

/**
 * The full plan for an import window.
 */
export interface FundValuationImportPlan {
  months: ImportPlanMonth[]
}

// ---------------------------------
// PLAN BUILDER
// ---------------------------------

/**
 * @summary
 * Builds the import plan for a given window.
 *
 * @remarks
 * Enumerates every covered month between the resolved start
 * and end dates. Each month entry carries the clamped slice
 * of the window that applies to it.
 *
 * @explanation
 * Use this function in the **Inngest** trigger to determine
 * how many month-worker events to fan out. The plan is
 * pure and does not touch any external system.
 *
 * @param window - The window option to plan.
 * @param now - The current reference time.
 * @returns The import plan with month entries.
 *
 * @example
 * const PLAN = buildImportPlan("last-6-months");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export function buildImportPlan(
  window: CvmImportWindow,
  now: Date = new Date()
): FundValuationImportPlan {
  const RANGE = resolveCvmWindow(window, now)
  const MONTHS = enumerateMonths(RANGE)

  return { months: MONTHS }
}

// ---------------------------------
// COMPOSITION ROOT
// ---------------------------------

/**
 * @summary
 * Runs the import for a single month and fund slice.
 *
 * @remarks
 * Instantiates the repositories and the use case, then
 * delegates to `importMonth`. This is the composition root
 * called by the **Inngest** worker.
 *
 * @explanation
 * Use this function to wire dependencies once per
 * invocation. Repositories and the **CVM** client are
 * created fresh so no state leaks between runs.
 *
 * @param input - The month, window dates, and slice params.
 * @returns Aggregated statistics for this slice.
 *
 * @example
 * const RESULT = await runFundValuationMonth(INPUT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
export async function runFundValuationMonth(
  input: ImportMonthInput
): Promise<ImportMonthResult> {
  const QUOTA_REPO = new QuotaRepository(db)
  const FUND_REPO = new FundRepository(db)
  const CVM_CLIENT = createCvmClient()

  const USE_CASE = new ImportFundValuationsUseCase(
    QUOTA_REPO,
    FUND_REPO,
    CVM_CLIENT
  )

  return USE_CASE.importMonth(input)
}

// ---------------------------------
// HELPERS
// ---------------------------------

// Enumerates every calendar month covered by the range.
function enumerateMonths(
  range: ImportWindowRange
): ImportPlanMonth[] {
  const MONTHS: ImportPlanMonth[] = []
  let cursor = new Date(
    Date.UTC(
      range.start.getUTCFullYear(),
      range.start.getUTCMonth(),
      1
    )
  )

  const END_YEAR = range.end.getUTCFullYear()
  const END_MONTH = range.end.getUTCMonth()

  while (
    cursor.getUTCFullYear() < END_YEAR ||
    (cursor.getUTCFullYear() === END_YEAR &&
      cursor.getUTCMonth() <= END_MONTH)
  ) {
    const YEAR = cursor.getUTCFullYear()
    const MONTH = cursor.getUTCMonth()

    const MONTH_START = new Date(Date.UTC(YEAR, MONTH, 1))
    const MONTH_END = new Date(
      Date.UTC(YEAR, MONTH + 1, 0, 23, 59, 59, 999)
    )

    MONTHS.push({
      year: YEAR,
      month: MONTH + 1,
      start: new Date(
        Math.max(MONTH_START.getTime(), range.start.getTime())
      ),
      end: new Date(
        Math.min(MONTH_END.getTime(), range.end.getTime())
      ),
    })

    cursor = new Date(Date.UTC(YEAR, MONTH + 1, 1))
  }

  return MONTHS
}
