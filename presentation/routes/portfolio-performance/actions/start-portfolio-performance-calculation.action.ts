"use server"

import {
  buildPerformanceCalculationPlan,
  type PortfolioPerformanceCalculationUnit,
} from "@/jobs/portfolio-performance-calculate.job"
import { RequireSessionUser } from "@/lib/auth/require-session"
import { PortfolioPerformanceContainer } from "@/presentation/composition/portfolio-performance.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

import { START_PORTFOLIO_PERFORMANCE_CALCULATION_SCHEMA } from "../validations/portfolio-performance-actions.validation"

import {
  completePortfolioPerformanceCalculationJob,
  createPortfolioPerformanceCalculationJob,
  updatePortfolioPerformanceCalculationJob,
} from "./portfolio-performance-calculate-job.store"

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
 * Starts a performance calculation for the given
 * portfolios and date range.
 *
 * @remarks
 * Resolves the session user, validates the target date
 * range with **Zod**, lists the user portfolios and builds
 * the portfolio × date plan. When `portfolioId` is null,
 * every portfolio of the user is calculated. The actual
 * calculation runs asynchronously in the background,
 * updating the job store while the client polls the
 * progress. The acting user is derived from the session,
 * never from the payload.
 *
 * @explanation
 * Use as the submit target of the calculate-confirm
 * dialog. The returned job id feeds the progress dialog
 * polling loop.
 *
 * @param input - The untrusted portfolios and date range
 *                payload.
 *
 * @returns The job id, or a failure result.
 *
 * @example
 * const RESULT = await startPortfolioPerformanceCalculationAction({
 *   portfolioId: null,
 *   from: "2026-09-01",
 *   to: "2026-09-30",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function startPortfolioPerformanceCalculationAction(
  input: unknown
): Promise<ActionResult<string>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED =
    START_PORTFOLIO_PERFORMANCE_CALCULATION_SCHEMA.safeParse(
      input
    )

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { list: LIST_PORTFOLIOS } =
      PortfolioPerformanceContainer()
    const PORTFOLIOS = await LIST_PORTFOLIOS.execute({
      userId: USER.id,
    })

    let TARGET_PORTFOLIOS = PORTFOLIOS

    if (PARSED.data.portfolioId !== null) {
      const TARGET = PORTFOLIOS.find(
        (portfolio) => portfolio.id === PARSED.data.portfolioId
      )

      if (!TARGET) {
        return ActionFailure("Carteira não encontrada.")
      }

      TARGET_PORTFOLIOS = [TARGET]
    }

    const FROM = ParseDayKey(PARSED.data.from)
    const TO = ParseDayKey(PARSED.data.to)

    const PLAN = buildPerformanceCalculationPlan({
      portfolioIds: TARGET_PORTFOLIOS.map(
        (portfolio) => portfolio.id
      ),
      from: FROM,
      to: TO,
    })

    if (PLAN.length === 0) {
      return ActionFailure("Nenhum cálculo a processar.")
    }

    const JOB_ID = createPortfolioPerformanceCalculationJob({
      portfolioCount: TARGET_PORTFOLIOS.length,
      daysTotal: CountInclusiveDays(FROM, TO),
    })

    void runPortfolioPerformanceCalculationJob(JOB_ID, PLAN)

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
async function runPortfolioPerformanceCalculationJob(
  jobId: string,
  plan: PortfolioPerformanceCalculationUnit[]
): Promise<void> {
  const { calculate: CALCULATE } =
    PortfolioPerformanceContainer()

  try {
    if (plan.length === 0) {
      completePortfolioPerformanceCalculationJob(
        jobId,
        "success"
      )
      return
    }

    let calculated = 0

    for (const UNIT of plan) {
      await CALCULATE.execute({
        portfolioId: UNIT.portfolioId,
        date: UNIT.date.toISOString(),
      })

      calculated += 1
      updatePortfolioPerformanceCalculationJob(jobId, {
        calculated,
      })
    }

    completePortfolioPerformanceCalculationJob(jobId, "success")
  } catch (cause) {
    completePortfolioPerformanceCalculationJob(
      jobId,
      "error",
      cause instanceof Error
        ? cause.message
        : "Falha durante o cálculo."
    )
  }
}
