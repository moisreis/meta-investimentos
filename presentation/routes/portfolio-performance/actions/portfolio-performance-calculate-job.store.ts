import type { PortfolioPerformanceCalculationProgress } from "../types/portfolio-performance-list.types"

// In-memory portfolio performance calculation jobs
// shared by the server actions of the performance
// registry.
const JOBS = new Map<
  string,
  PortfolioPerformanceCalculationProgress
>()

// How long a finished job stays readable before pruning.
const JOB_TTL_MS = 10 * 60 * 1000

/**
 * @summary
 * Creates a running performance calculation job.
 *
 * @remarks
 * Registers the job in the in-memory store and prunes
 * the finished jobs that exceed the time-to-live.
 *
 * @explanation
 * Use after building the calculation plan so the client
 * can poll the progress snapshot through its job id.
 *
 * @param input - The plan totals.
 * @param input.portfolioCount - The portfolios to process.
 * @param input.daysTotal - The days of the period.
 *
 * @returns The id of the created job.
 *
 * @example
 * const JOB_ID = createPortfolioPerformanceCalculationJob({
 *   portfolioCount: 2,
 *   daysTotal: 30,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function createPortfolioPerformanceCalculationJob(input: {
  portfolioCount: number
  daysTotal: number
}): string {
  prunePortfolioPerformanceCalculationJobs()

  const ID = crypto.randomUUID()

  JOBS.set(ID, {
    id: ID,
    status: "running",
    portfolioCount: input.portfolioCount,
    daysTotal: input.daysTotal,
    calculated: 0,
    error: null,
    completedAt: null,
  })

  return ID
}

/**
 * @summary
 * Returns a performance calculation job snapshot.
 *
 * @param id - The id of the job to read.
 *
 * @returns The job snapshot, or `null`.
 *
 * @example
 * const JOB = getPortfolioPerformanceCalculationJob(JOB_ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function getPortfolioPerformanceCalculationJob(
  id: string
): PortfolioPerformanceCalculationProgress | null {
  return JOBS.get(id) ?? null
}

/**
 * @summary
 * Updates the running counters of a calculation job.
 *
 * @param id - The id of the job to update.
 * @param patch - The partial counters to write.
 *
 * @example
 * updatePortfolioPerformanceCalculationJob(JOB_ID, {
 *   calculated: 1,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function updatePortfolioPerformanceCalculationJob(
  id: string,
  patch: Partial<
    Pick<PortfolioPerformanceCalculationProgress, "calculated">
  >
): void {
  const JOB = JOBS.get(id)

  if (!JOB) return

  JOBS.set(id, { ...JOB, ...patch })
}

/**
 * @summary
 * Marks a performance calculation job as finished.
 *
 * @remarks
 * Writes the terminal status, an optional error message,
 * and the completion timestamp used by the pruner.
 *
 * @param id - The id of the job to complete.
 * @param status - The terminal status.
 * @param error - The error message when status is error.
 *
 * @example
 * completePortfolioPerformanceCalculationJob(
 *   JOB_ID,
 *   "success"
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function completePortfolioPerformanceCalculationJob(
  id: string,
  status: "success" | "error",
  error: string | null = null
): void {
  const JOB = JOBS.get(id)

  if (!JOB) return

  JOBS.set(id, {
    ...JOB,
    status,
    error,
    completedAt: Date.now(),
  })
}

// Removes the finished jobs that exceeded the time-to-live.
function prunePortfolioPerformanceCalculationJobs(): void {
  const NOW = Date.now()

  for (const [id, job] of JOBS) {
    if (
      job.completedAt !== null &&
      NOW - job.completedAt > JOB_TTL_MS
    ) {
      JOBS.delete(id)
    }
  }
}
