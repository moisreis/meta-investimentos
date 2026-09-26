"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import {
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import type { PortfolioPerformanceCalculationProgress } from "../types/portfolio-performance-list.types"
import { GET_PORTFOLIO_PERFORMANCE_CALCULATION_PROGRESS_SCHEMA } from "../validations/portfolio-performance-actions.validation"

import { getPortfolioPerformanceCalculationJob } from "./portfolio-performance-calculate-job.store"

/**
 * @summary
 * Returns the current snapshot of a performance
 * calculation job.
 *
 * @remarks
 * Resolves the session user and reads the in-memory job
 * by id. A successful result carrying `null` means there
 * is no active session or the job no longer exists.
 *
 * @explanation
 * Use as the polling target of the calculation progress
 * dialog.
 *
 * @param input - The untrusted job id payload.
 *
 * @returns The job snapshot, `null`, or a failure result.
 *
 * @example
 * const RESULT =
 *   await getPortfolioPerformanceCalculationProgressAction({
 *     jobId: "job-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function getPortfolioPerformanceCalculationProgressAction(
  input: unknown
): Promise<
  ActionResult<PortfolioPerformanceCalculationProgress | null>
> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionSuccess(null)
  }

  const PARSED =
    GET_PORTFOLIO_PERFORMANCE_CALCULATION_PROGRESS_SCHEMA.safeParse(
      input
    )

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    return ActionSuccess(
      getPortfolioPerformanceCalculationJob(PARSED.data.jobId)
    )
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível ler o progresso do cálculo."
    )
  }
}
