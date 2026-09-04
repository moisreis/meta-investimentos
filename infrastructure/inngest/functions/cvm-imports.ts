import { eventType } from "inngest";

import { inngest } from "@/infrastructure/inngest/client";
import type {
  CvmImportFundRequestedPayload,
  CvmImportRequestedPayload,
} from "@/infrastructure/inngest/events";
import {
  cvmImportFundIdempotencyKey,
  cvmImportIdempotencyKey,
} from "@/infrastructure/inngest/idempotency";
import { getJobRunLedger } from "@/infrastructure/inngest/job-run.ledger.instance";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry";

import { resolveTrackedFundCnpjs } from "./data-sourcing";

/**
 * The on-demand CVM import orchestrator.
 *
 * Receives a `cvm/import.requested` event, opens a durable run record
 * and fans out one `cvm/import.fund.requested` event per requested fund
 * CNPJ (or per every tracked fund when no subset is provided). The
 * per-fund workers run under a per-fund concurrency so no two imports
 * ever write the same fund's quota table at the same time.
 */
export const cvmImportJob = inngest.createFunction(
  {
    id: "cvm-import",
    triggers: eventType("cvm/import.requested"),
    concurrency: { limit: 1 },
    idempotency: "cvm-import:{{event.data.id}}:{{event.data.monthsBack}}",
    retries: RETRY_ATTEMPTS.cvmImport,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = event.data as CvmImportRequestedPayload;

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "cvm-import",
        eventType: "cvm/import.requested",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: cvmImportIdempotencyKey(payload),
        maxRetries: RETRY_ATTEMPTS.cvmImport,
      }),
    );

    const cnpjs = await step.run("resolve-funds", () =>
      resolveTrackedFundCnpjs(payload.requestedCnpjs),
    );

    await step.run("job-run.progress", () => ledger.progress(run.runId, 30));

    await step.sendEvent(
      "fanout-per-fund",
      cnpjs.map((fundCnpj) => ({
        name: "cvm/import.fund.requested",
        data: {
          id: payload.id,
          fundCnpj,
          monthsBack: payload.monthsBack,
          requestedStart: payload.requestedStart,
          requestedEnd: payload.requestedEnd,
        },
      })),
    );

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, {
        requestedCnpjs: cnpjs.length,
        sentEvents: cnpjs.length,
      }),
    );

    return { requestedCnpjs: cnpjs.length, sentEvents: cnpjs.length };
  },
);

/**
 * The per-fund CVM import runner.
 *
 * Imports the quota history of a single fund, then recalculates the
 * performance of every portfolio holding that fund so the newly
 * imported quotes are reflected immediately.
 */
export const cvmImportFundJob = inngest.createFunction(
  {
    id: "cvm-import-fund",
    triggers: eventType("cvm/import.fund.requested"),
    concurrency: { limit: 1, key: "fund:{{event.data.fundCnpj}}" },
    idempotency: "cvm-import-fund:{{event.data.id}}:{{event.data.fundCnpj}}",
    retries: RETRY_ATTEMPTS.cvmImportFund,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = event.data as CvmImportFundRequestedPayload;

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "cvm-import-fund",
        eventType: "cvm/import.fund.requested",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: cvmImportFundIdempotencyKey(
          payload.id,
          payload.fundCnpj,
        ),
        maxRetries: RETRY_ATTEMPTS.cvmImportFund,
      }),
    );

    const summary = await step.run("import-fund", async () => {
      const [{ db }, { UnitOfWork }, { runCvmImport }, { createCvmClient }] =
        await Promise.all([
          import("@/infrastructure/clients/drizzle.client"),
          import("@/infrastructure/unit-of-work"),
          import("@/business/use-cases/cvm/run-cvm-import.uc"),
          import("@/infrastructure/clients/cvm.client"),
        ]);

      const IMPORT = await new UnitOfWork(db).run((tx) =>
        runCvmImport(tx, {
          client: createCvmClient(),
          requestedStart: payload.requestedStart
            ? new Date(payload.requestedStart)
            : undefined,
          requestedEnd: payload.requestedEnd
            ? new Date(payload.requestedEnd)
            : undefined,
          monthsBack: payload.monthsBack,
          requestedCnpjs: [payload.fundCnpj],
        }),
      );

      return {
        importId: IMPORT.id?.toString(),
        recordsImported: IMPORT.recordsImported,
        recordsUpserted: IMPORT.recordsUpserted,
        recordsSkipped: IMPORT.recordsSkipped,
        requestedStart: payload.requestedStart,
        requestedEnd: payload.requestedEnd,
      };
    });

    await step.run("job-run.progress", () => ledger.progress(run.runId, 60));

    await step.run("recalculate-affected-portfolios", async () => {
      if (!summary.importId) {
        return;
      }
      const [{ db }, { UnitOfWork }, { recalculateAffectedPortfolios }] =
        await Promise.all([
          import("@/infrastructure/clients/drizzle.client"),
          import("@/infrastructure/unit-of-work"),
          import("@/business/use-cases/cvm/recalculate-affected-portfolios.uc"),
        ]);

      const START = summary.requestedStart
        ? new Date(summary.requestedStart)
        : new Date();
      const END = summary.requestedEnd
        ? new Date(summary.requestedEnd)
        : new Date();

      await new UnitOfWork(db).run((tx) =>
        recalculateAffectedPortfolios(tx, {
          importId: summary.importId as string,
          fundIds: [payload.fundCnpj],
          startDate: START,
          endDate: END,
        }),
      );
    });

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, summary),
    );

    return summary;
  },
);
