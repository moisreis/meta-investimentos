import type { JobRun } from "@/business/entities/inngest/job-run.entity";

import type { SystemHealthCheck, SystemHealthDto } from "./system-health.dtos";

/**
 * The window (in milliseconds) in which a failed job run counts as an
 * active incident for the health report.
 */
const JOB_FAILURE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * The dependencies required by {@link getSystemHealth}.
 *
 * The probe is deliberately decoupled from the persistence layer so it
 * stays unit-testable; the caller wires the concrete lookup.
 */
export interface SystemHealthDeps {
  /**
   * Retrieves the most recent job runs, newest first.
   *
   * @param limit - The maximum number of runs to return.
   * @returns A promise resolving to the matching `JobRun` entities.
   */
  findRecentRuns: (limit?: number) => Promise<JobRun[]>;
}

/**
 * Computes the platform health report.
 *
 * The report is the worst state across its sub-checks:
 *
 * - `database` is healthy whenever the run lookup itself resolves;
 *   a thrown lookup is surfaced by the caller as a `down` report.
 * - `jobs` is healthy when no job run failed within the last
 *   {@link JOB_FAILURE_WINDOW_MS 24 hours}; a single failure degrades
 *   the overall status to `degraded`.
 *
 * @param deps - The runtime lookups the probe reads from.
 * @returns The overall health report.
 */
export async function getSystemHealth(
  deps: SystemHealthDeps,
): Promise<SystemHealthDto> {
  const RECENT_RUNS = await deps.findRecentRuns(100);
  const NOW = Date.now();

  const FAILED_RUNS = RECENT_RUNS.filter((RUN) => {
    if (RUN.status !== "FAILED") {
      return false;
    }
    const FAILED_AT = RUN.finishedAt ?? RUN.createdAt;
    return FAILED_AT.getTime() >= NOW - JOB_FAILURE_WINDOW_MS;
  }).length;

  const CHECKS: SystemHealthCheck[] = [
    { name: "database", status: "healthy" },
    {
      name: "jobs",
      status: FAILED_RUNS === 0 ? "healthy" : "degraded",
      ...(FAILED_RUNS > 0
        ? {
            message: `${FAILED_RUNS} job run(s) falharam nas últimas 24 horas.`,
          }
        : {}),
    },
  ];

  return {
    status: FAILED_RUNS === 0 ? "healthy" : "degraded",
    updatedAt: new Date().toISOString(),
    checks: CHECKS,
  };
}
