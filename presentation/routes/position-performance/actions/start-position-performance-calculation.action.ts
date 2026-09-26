"use server"

import {
  buildPositionPerformanceCalculationPlan,
  type PositionPerformanceCalculationUnit,
} from "@/jobs/position-performance-calculate.job"
import { RequireSessionUser } from "@/lib/auth/require-session"
import { PositionPerformanceContainer } from "@/presentation/composition/position-performance.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import { START_POSITION_PERFORMANCE_CALCULATION_SCHEMA } from "../validations/position-performance-actions.validation"

import {
  completePositionPerformanceCalculationJob,
  createPositionPerformanceCalculationJob,
  updatePositionPerformanceCalculationJob,
} from "./position-performance-calculation-job.store"

// Milliseconds in a single calendar day.
const DAY_MS = 24 * 60 * 60 * 1000

// Builds the UTC midnight of a `yyyy-MM-dd` day key.
function ParseDayKey(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`)
}

// Counts the inclusive calendar days of a period.
function CountInclusiveDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS) + 1
}

/**
 * @summary
 * Starts a position performance calculation for the
 * given positions and date range.
 *
 * @remarks
 * Resolves the session user, validates the target date
 * range with **Zod**, lists the user portfolios and
 * positions and builds the position × date plan. When
 * `positionId` is null, every position of the user is
 * calculated. The actual calculation runs asynchronously in
 * the background, updating the job store while the client
 * polls the progress. The acting user is derived from the
 * session, never from the payload.
 *
 * @explanation
 * Use as the submit target of the calculate-confirm
 * dialog. The returned job id feeds the progress dialog
 * polling loop.
 *
 * @param input - The untrusted positions and date range
 *                payload.
 *
 * @returns The job id, or a failure result.
 *
 * @example
 * const RESULT = await startPositionPerformanceCalculationAction({
 *   positionId: null,
 *   from: "2026-09-01",
 *   to: "2026-09-30",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function startPositionPerformanceCalculationAction(
  input: unknown
): Promise<ActionResult<string>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    START_POSITION_PERFORMANCE_CALCULATION_SCHEMA.safeParse(
      input
    )

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const {
      list: LIST_PORTFOLIOS,
      listPositions: LIST_POSITIONS,
    } = PositionPerformanceContainer()

    const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
      userId: USER.id,
    })
    const POSITIONS = await LIST_POSITIONS.execute({
      portfolioIds: PORTFOLIOS.map((portfolio) => portfolio.id),
    })

    let TARGET_POSITIONS = POSITIONS

    if (PARSED.data.positionId !== null) {
      const TARGET = POSITIONS.find(
        (position) => position.id === PARSED.data.positionId
      )

      if (!TARGET) {
        return ActionFailure("Posição não encontrada.")
      }

      TARGET_POSITIONS = [TARGET]
    }

    const FROM = ParseDayKey(PARSED.data.from)
    const TO = ParseDayKey(PARSED.data.to)

    const PLAN = buildPositionPerformanceCalculationPlan({
      positionIds: TARGET_POSITIONS.map(
        (position) => position.id
      ),
      from: FROM,
      to: TO,
    })

    if (PLAN.length === 0) {
      return ActionFailure("Nenhum cálculo a processar.")
    }

    const JOB_ID = createPositionPerformanceCalculationJob({
      positionCount: TARGET_POSITIONS.length,
      daysTotal: CountInclusiveDays(FROM, TO),
    })

    void runPositionPerformanceCalculationJob(JOB_ID, PLAN)

    return ActionSuccess(JOB_ID)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível iniciar o cálculo."
    )
  }
}

// Runs the full calculation plan and publishes the
// progress snapshots into the job store.
async function runPositionPerformanceCalculationJob(
  jobId: string,
  plan: PositionPerformanceCalculationUnit[]
): Promise<void> {
  const { calculate: CALCULATE } = PositionPerformanceContainer()

  try {
    if (plan.length === 0) {
      completePositionPerformanceCalculationJob(jobId, "success")
      return
    }

    let calculated = 0

    for (const UNIT of plan) {
      await CALCULATE.execute({
        positionId: UNIT.positionId,
        date: UNIT.date.toISOString(),
      })

      calculated += 1
      updatePositionPerformanceCalculationJob(jobId, {
        calculated,
      })
    }

    completePositionPerformanceCalculationJob(jobId, "success")
  } catch (cause) {
    completePositionPerformanceCalculationJob(
      jobId,
      "error",
      cause instanceof Error
        ? cause.message
        : "Falha durante o cálculo."
    )
  }
}
