"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { DomainError } from "@/errors"
import {
  buildImportPlan,
  runFundValuationMonth,
  type FundValuationImportPlan,
} from "@/jobs/fund-valuation-import.job"
import {
  FUND_SLICE_SIZE,
  type CvmImportWindow,
} from "@/services/quota/use-cases/import-fund-valuations.use-case"

import {
  completeQuotaImportJob,
  createQuotaImportJob,
  updateQuotaImportJob,
} from "./quota-import-job.store"

// Import windows accepted by the start action.
const IMPORT_WINDOWS: readonly CvmImportWindow[] = [
  "today",
  "week",
  "month",
  "year-to-date",
  "last-2-months",
  "last-6-months",
]

export interface StartQuotaImportActionInput {
  window: string
}

export interface StartQuotaImportActionResult {
  jobId: string | null
  error: string | null
}

/**
 * @summary
 * Starts a real-time quota import for the given window.
 *
 * @remarks
 * Resolves the session user, validates the window option,
 * builds the import plan and registers a job. The actual
 * import runs asynchronously in the background, updating
 * the job store while the client polls the progress.
 *
 * @explanation
 * Use as the submit target of the quota confirm-import
 * dialog. The returned job id feeds the progress dialog
 * polling loop.
 *
 * @param input - The import window to process.
 *
 * @returns The job id and an optional error.
 *
 * @example
 * const RESULT = await startQuotaImportAction({
 *   window: "month",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function startQuotaImportAction(
  input: StartQuotaImportActionInput
): Promise<StartQuotaImportActionResult> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { jobId: null, error: "Faça login para continuar." }
    }

    if (!isCvmImportWindow(input.window)) {
      return {
        jobId: null,
        error: "Período de importação inválido.",
      }
    }

    const PLAN = buildImportPlan(input.window)
    const JOB_ID = createQuotaImportJob(
      input.window,
      PLAN.months.length
    )

    void runQuotaImportJob(JOB_ID, PLAN)

    return { jobId: JOB_ID, error: null }
  } catch (cause) {
    return {
      jobId: null,
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível iniciar a importação.",
    }
  }
}

// Returns whether the provided value is a valid window.
function isCvmImportWindow(
  value: string
): value is CvmImportWindow {
  return IMPORT_WINDOWS.includes(value as CvmImportWindow)
}

// Runs the full import plan and publishes the progress
// snapshots into the job store.
async function runQuotaImportJob(
  jobId: string,
  plan: FundValuationImportPlan
): Promise<void> {
  try {
    if (plan.months.length === 0) {
      completeQuotaImportJob(jobId, "success")
      return
    }

    let rowsImported = 0
    let skipped = 0
    let monthsDone = 0

    for (const MONTH of plan.months) {
      let offset = 0

      while (true) {
        const RESULT = await runFundValuationMonth({
          year: MONTH.year,
          month: MONTH.month,
          start: MONTH.start,
          end: MONTH.end,
          offset,
          limit: FUND_SLICE_SIZE,
        })

        rowsImported += RESULT.rowsImported
        skipped += RESULT.skipped

        if (!RESULT.hasMore) break

        offset = RESULT.nextOffset
      }

      monthsDone += 1
      updateQuotaImportJob(jobId, {
        monthsDone,
        rowsImported,
        skipped,
      })
    }

    completeQuotaImportJob(jobId, "success")
  } catch (cause) {
    completeQuotaImportJob(
      jobId,
      "error",
      cause instanceof Error
        ? cause.message
        : "Falha durante a importação."
    )
  }
}
