import { eventType } from "inngest";

import { inngest } from "@/infrastructure/inngest/client";
import type { FundQuoteRefreshPayload } from "@/infrastructure/inngest/events";
import { fundQuoteRefreshIdempotencyKey } from "@/infrastructure/inngest/idempotency";
import { getJobRunLedger } from "@/infrastructure/inngest/job-run.ledger.instance";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry";

import { resolveTrackedFundCnpjs } from "./data-sourcing";

/**
 * The nightly (or on-demand) fund quote refresh worker.
 *
 * Receives a `fund/refresh.quotes` event and fans out one per-fund import
 * run for every tracked fund (or the requested subset). The per-fund
 * runner reuses the regular import path — download, match, upsert — and
 * recalculates the affected portfolios afterwards.
 */
export const quoteRefreshJob = inngest.createFunction(
  {
    id: "fund-quote-refresh",
    triggers: eventType("fund/refresh.quotes"),
    concurrency: { limit: 1 },
    idempotency: "fund-quote-refresh:{{event.data.date}}",
    retries: RETRY_ATTEMPTS.fundQuoteRefresh,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = event.data as FundQuoteRefreshPayload;

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "fund-quote-refresh",
        eventType: "fund/refresh.quotes",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: fundQuoteRefreshIdempotencyKey(
          payload.date,
          payload.requestedCnpjs,
        ),
        maxRetries: RETRY_ATTEMPTS.fundQuoteRefresh,
      }),
    );

    const cnpjs = await step.run("resolve-funds", () =>
      resolveTrackedFundCnpjs(payload.requestedCnpjs),
    );
    const monthsBack = payload.date ? 1 : 2;

    await step.sendEvent(
      "fanout-per-fund",
      cnpjs.map((fundCnpj) => ({
        name: "cvm/import.fund.requested",
        data: {
          id: `quote-refresh-${payload.date ?? "latest"}`,
          fundCnpj,
          monthsBack,
          requestedEnd: payload.date,
        },
      })),
    );

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, {
        requestedCnpjs: cnpjs.length,
        monthsBack,
        sentEvents: cnpjs.length,
      }),
    );

    return {
      requestedCnpjs: cnpjs.length,
      monthsBack,
      sentEvents: cnpjs.length,
    };
  },
);
