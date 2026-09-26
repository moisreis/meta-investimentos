"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"
import {
  buildImportPlan,
  runFundValuationMonth,
  type FundValuationImportPlan,
} from "@/jobs/fund-valuation-import.job"
import { FUND_SLICE_SIZE } from "@/services/quota/use-cases/import-fund-valuations.use-case"

import { START_QUOTA_IMPORT_SCHEMA } from "../validations/quota-actions.validation"
import {
  completeQuotaImportJob,
  createQuotaImportJob,
  updateQuotaImportJob,
} from "./quota-import-job.store"

/**
 * @summary
 * Starts a real-time quota import for the given window.
 *
 * @remarks
 * Resolves the session first, then validates the import
 * window with **Zod**, builds the import plan and registers
 * a job. The acting user is derived from the session, never
 * from the payload. The actual import runs asynchronously in
 * the background through the fund valuation job, which owns
 * its own composition root, updating the job store while the
 * client polls the progress.
 *
 * @explanation
 * Use as the submit target of the quota confirm-import
 * dialog. The returned job id feeds the progress dialog
 * polling loop.
 *
 * @param input - The untrusted import window payload.
 *
 * @returns The id of the created job, or a failure result.
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
  input: unknown
): Promise<ActionResult<string>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = START_QUOTA_IMPORT_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const PLAN = buildImportPlan(PARSED.data.window)
    const JOB_ID = createQuotaImportJob(
      PARSED.data.window,
      PLAN.months.length
    )

    void runQuotaImportJob(JOB_ID, PLAN)

    return ActionSuccess(JOB_ID)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível iniciar a importação."
    )
  }
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
