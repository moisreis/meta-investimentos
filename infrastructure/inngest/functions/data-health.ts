import { eventType } from "inngest";

import { inngest } from "@/infrastructure/inngest/client";
import { assertJobHealthCheck } from "@/infrastructure/inngest/contracts";
import { dataHealthCheckIdempotencyKey } from "@/infrastructure/inngest/idempotency";
import { getJobRunLedger } from "@/infrastructure/inngest/job-run.ledger.instance";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry";

/**
 * The wall-clock milliseconds of one hour.
 */
const HOUR_MS = 3_600_000;

/**
 * The maximum age, in hours, a run may stay `RUNNING` before it is
 * flagged as stuck.
 */
const STUCK_RUN_MAX_AGE_HOURS = 24;

/**
 * The data-health check worker.
 *
 * Receives a `job/health.check` event and scans the application data for
 * anomalies: imports, runs and tracked registry size. Every anomaly is
 * reported in the result summary, which is kept in the durable job-run
 * ledger for auditing.
 */
export const dataHealthJob = inngest.createFunction(
  {
    id: "data-health",
    triggers: eventType("job/health.check"),
    concurrency: { limit: 1 },
    idempotency: "job-health:{{event.data.date}}",
    retries: RETRY_ATTEMPTS.dataHealth,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = assertJobHealthCheck(event.data);

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "data-health",
        eventType: "job/health.check",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: dataHealthCheckIdempotencyKey(payload.date),
        maxRetries: RETRY_ATTEMPTS.dataHealth,
      }),
    );

    const summary = await step.run("scan-data-health", async () => {
      const [
        { db },
        { CvmImportRepository },
        { JobRunRepository },
        { FundRepository },
        { PortfolioRepository },
      ] = await Promise.all([
        import("@/infrastructure/clients/drizzle.client"),
        import("@/infrastructure/repositories/fund/cvm-import.repository"),
        import("@/infrastructure/repositories/inngest/job-run.repository"),
        import("@/infrastructure/repositories/fund/fund.repository"),
        import("@/infrastructure/repositories/portfolio/portfolio.repository"),
      ]);

      const NOW = Date.now();
      const FINDINGS = [] as string[];

      const fundCount = (await new FundRepository(db).findAll({ limit: 1 }))
        .length;
      const portfolioCount = (
        await new PortfolioRepository(db).findAll({ limit: 1 })
      ).length;
      const latestImport = await new CvmImportRepository(db).findLatest();
      if (latestImport?.status === "RUNNING") {
        const AGE_HOURS = Math.floor(
          (NOW - latestImport.startedAt.getTime()) / HOUR_MS,
        );
        if (AGE_HOURS > STUCK_RUN_MAX_AGE_HOURS) {
          FINDINGS.push(
            `Latest CVM import ${latestImport.id} is running for ${AGE_HOURS}h.`,
          );
        }
      }

      const jobRuns = new JobRunRepository(db);
      const failedRuns = await jobRuns.findByStatus("FAILED", 100);
      if (failedRuns.length > 0) {
        FINDINGS.push(`${failedRuns.length} job runs failed.`);
      }
      const runningRuns = await jobRuns.findByStatus("RUNNING", 100);
      for (const run of runningRuns) {
        const AGE_HOURS = Math.floor((NOW - run.startedAt.getTime()) / HOUR_MS);
        if (AGE_HOURS > STUCK_RUN_MAX_AGE_HOURS) {
          FINDINGS.push(`Job run ${run.id} is running for ${AGE_HOURS}h.`);
        }
      }

      return {
        checkedAt: new Date().toISOString(),
        date: payload.date,
        counts: {
          funds: fundCount,
          portfolios: portfolioCount,
          failedRuns: failedRuns.length,
          runningRuns: runningRuns.length,
        },
        findings: FINDINGS,
      };
    });

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, summary),
    );

    return summary;
  },
);
