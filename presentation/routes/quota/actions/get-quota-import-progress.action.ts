"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import {
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import type { QuotaImportProgress } from "../types/quota-list.types"
import { GET_QUOTA_IMPORT_PROGRESS_SCHEMA } from "../validations/quota-actions.validation"
import { getQuotaImportJob } from "./quota-import-job.store"

/**
 * @summary
 * Returns the current snapshot of a quota import job.
 *
 * @remarks
 * Resolves the session first, then validates the job id
 * with **Zod**, and only then reads the in-memory job. The
 * acting user is derived from the session, never from the
 * payload. The payload is preserved as-is: a successful
 * result carries the job snapshot, and `null` is returned
 * when there is no active session or the job no longer
 * exists.
 *
 * @explanation
 * Use as the polling target of the quota import progress
 * dialog.
 *
 * @param input - The untrusted job id payload.
 *
 * @returns The job snapshot, `null`, or a failure result.
 *
 * @example
 * const RESULT = await getQuotaImportProgressAction({
 *   jobId: "job-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function getQuotaImportProgressAction(
  input: unknown
): Promise<ActionResult<QuotaImportProgress | null>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionSuccess(null)
  }

  const PARSED =
    GET_QUOTA_IMPORT_PROGRESS_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    return ActionSuccess(getQuotaImportJob(PARSED.data.jobId))
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível consultar o progresso da importação."
    )
  }
}
