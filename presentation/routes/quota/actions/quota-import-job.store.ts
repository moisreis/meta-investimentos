import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"

import type { QuotaImportProgress } from "../types/quota-list.types"

// In-memory quota import jobs shared by the server
// actions of the quota registry.
const JOBS = new Map<string, QuotaImportProgress>()

// How long a finished job stays readable before pruning.
const JOB_TTL_MS = 10 * 60 * 1000

/**
 * @summary
 * Creates a running quota import job.
 *
 * @remarks
 * Registers the job in the in-memory store and prunes
 * the finished jobs that exceed the time-to-live.
 *
 * @explanation
 * Use after building the import plan so the client can
 * poll the progress snapshot through its job id.
 *
 * @param window - The import window being processed.
 * @param monthsTotal - The number of months to import.
 *
 * @returns The id of the created job.
 *
 * @example
 * const JOB_ID = createQuotaImportJob("month", 1);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function createQuotaImportJob(
  window: CvmImportWindow,
  monthsTotal: number
): string {
  pruneQuotaImportJobs()

  const ID = crypto.randomUUID()

  JOBS.set(ID, {
    id: ID,
    window,
    status: "running",
    monthsTotal,
    monthsDone: 0,
    rowsImported: 0,
    skipped: 0,
    error: null,
    completedAt: null,
  })

  return ID
}

/**
 * @summary
 * Returns a quota import job snapshot.
 *
 * @param id - The id of the job to read.
 *
 * @returns The job snapshot, or `null`.
 *
 * @example
 * const JOB = getQuotaImportJob(JOB_ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function getQuotaImportJob(
  id: string
): QuotaImportProgress | null {
  return JOBS.get(id) ?? null
}

/**
 * @summary
 * Updates the running counters of a quota import job.
 *
 * @param id - The id of the job to update.
 * @param patch - The partial counters to write.
 *
 * @example
 * updateQuotaImportJob(JOB_ID, { monthsDone: 1 });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function updateQuotaImportJob(
  id: string,
  patch: Partial<
    Pick<
      QuotaImportProgress,
      "monthsDone" | "rowsImported" | "skipped"
    >
  >
): void {
  const JOB = JOBS.get(id)

  if (!JOB) return

  JOBS.set(id, { ...JOB, ...patch })
}

/**
 * @summary
 * Marks a quota import job as finished.
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
 * completeQuotaImportJob(JOB_ID, "success");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function completeQuotaImportJob(
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
function pruneQuotaImportJobs(): void {
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
