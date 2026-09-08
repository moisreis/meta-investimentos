import { describe, expect, it } from "vitest";

import { JobRun } from "@/business/entities/inngest/job-run.entity";
import {
  getSystemHealth,
  type SystemHealthDeps,
} from "@/business/use-cases/system/system-health.uc";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Builds a job run ledger for the health probe.
 *
 * @param status - The lifecycle status of the run.
 * @param finishedAt - When the run finished, when known.
 * @param createdAt - When the run record was created.
 * @returns A valid `JobRun` instance.
 */
function jobRun(
  status: "COMPLETED" | "FAILED",
  finishedAt?: Date,
  createdAt?: Date,
): JobRun {
  return JobRun.create(
    {
      jobName: "import-cvm-positions",
      status,
      eventType: "cvm/import.requested",
      eventPayload: { importId: "import-1" },
      errorMessage:
        status === "FAILED" ? "Quota file could not be parsed." : undefined,
      finishedAt,
      createdAt,
    },
    status === "FAILED" ? LOG_FAILED_ID : undefined,
  );
}

const LOG_FAILED_ID = "99999999-9999-4999-8999-999999999999";

/**
 * Builds the probe dependencies resolving to the provided runs.
 *
 * @param runs - The runs the lookup returns.
 * @returns The `SystemHealthDeps` instance.
 */
function deps(runs: JobRun[]): SystemHealthDeps {
  return {
    findRecentRuns: async () => runs,
  };
}

describe("getSystemHealth", () => {
  describe("success", () => {
    it("reports healthy when no recent job run failed", async () => {
      const RESULT = await getSystemHealth(
        deps([jobRun("COMPLETED", new Date(Date.now() - HOUR_MS))]),
      );

      expect(RESULT.status).toBe("healthy");
      expect(RESULT.checks).toEqual([
        { name: "database", status: "healthy" },
        { name: "jobs", status: "healthy" },
      ]);
    });

    it("reports degraded when a job run failed within the last 24 hours", async () => {
      const RESULT = await getSystemHealth(
        deps([jobRun("FAILED", new Date(Date.now() - HOUR_MS))]),
      );

      expect(RESULT.status).toBe("degraded");
      expect(RESULT.checks.find((check) => check.name === "jobs")).toEqual({
        name: "jobs",
        status: "degraded",
        message: "1 job run(s) falharam nas últimas 24 horas.",
      });
    });

    it("ignores failures older than the 24 hour window", async () => {
      const OLD_FAILURE = new Date(Date.now() - 2 * DAY_MS);
      const RESULT = await getSystemHealth(
        deps([jobRun("FAILED", OLD_FAILURE, OLD_FAILURE)]),
      );

      expect(RESULT.status).toBe("healthy");
      expect(RESULT.checks.find((check) => check.name === "jobs")?.status).toBe(
        "healthy",
      );
    });

    it("falls back to the record creation time when a failed run never finished", async () => {
      const STARTED = new Date(Date.now() - 2 * HOUR_MS);
      const RESULT = await getSystemHealth(
        deps([jobRun("FAILED", undefined, STARTED)]),
      );

      expect(RESULT.status).toBe("degraded");
      expect(RESULT.checks.find((check) => check.name === "jobs")?.status).toBe(
        "degraded",
      );
    });
  });
});
