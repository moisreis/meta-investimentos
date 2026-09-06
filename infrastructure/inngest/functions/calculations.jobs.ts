import { eventType } from "inngest";
import {
  dailyCalculationIdempotencyKey,
  performanceCalculateIdempotencyKey,
} from "@/infrastructure/inngest/idempotency.utils";
import { inngest } from "@/infrastructure/inngest/inngest.provider";
import { getJobRunLedger } from "@/infrastructure/inngest/job-run.ledger.provider";
import {
  assertPerformanceCalculateDaily,
  assertPerformanceCalculateRequested,
} from "@/infrastructure/inngest/payloads.contracts";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry.utils";

import { resolveAllPortfolioIds } from "./data-sourcing.utils";

/**
 * The on-demand portfolio performance recalculation worker.
 *
 * Receives a `performance/calculate.requested` event and recalculates a
 * single portfolio for one canonical reference period. Supported periods
 * mirror the {@link ReferenceDatePolicy}: `date`, `month`,
 * `year-to-date`, `trailing-12m` and `range` (with `endDate`).
 *
 * The recalculation executes inside a transaction and skips the
 * per-portfolio calculation lock because the engine acquires it itself.
 */
export const performanceCalculationJob = inngest.createFunction(
  {
    id: "performance-calculation",
    triggers: eventType("performance/calculate.requested"),
    concurrency: {
      limit: 1,
      key: "portfolio:{{event.data.portfolioId}}",
    },
    idempotency:
      "performance-calc:{{event.data.id}}:{{event.data.portfolioId}}:{{event.data.period}}:{{event.data.anchor}}:{{event.data.endDate}}",
    retries: RETRY_ATTEMPTS.performanceCalculation,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = assertPerformanceCalculateRequested(event.data);

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "performance-calculation",
        eventType: "performance/calculate.requested",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: performanceCalculateIdempotencyKey(payload),
        maxRetries: RETRY_ATTEMPTS.performanceCalculation,
      }),
    );

    await step.run("recalculate", async () => {
      const [{ db }, { UnitOfWork }, { recalculatePerformanceForPeriod }] =
        await Promise.all([
          import("@/infrastructure/clients/drizzle.client"),
          import("@/infrastructure/unit-of-work"),
          import(
            "@/business/use-cases/performance/recalculate-performance-for-period.uc"
          ),
        ]);

      await new UnitOfWork(db).run((tx) =>
        recalculatePerformanceForPeriod(tx, {
          portfolioId: payload.portfolioId,
          period: payload.period,
          anchor: new Date(payload.anchor),
          endDate: payload.endDate ? new Date(payload.endDate) : undefined,
          businessDay: payload.businessDay,
        }),
      );
    });

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, {
        portfolioId: payload.portfolioId,
        period: payload.period,
        anchor: payload.anchor,
        endDate: payload.endDate,
      }),
    );

    return {
      portfolioId: payload.portfolioId,
      period: payload.period,
      anchor: payload.anchor,
    };
  },
);

/**
 * The nightly performance roll-up worker.
 *
 * Receives a `performance/calculate.daily` event, resolves every
 * registered portfolio and fans out one current-date recalculation per
 * portfolio. Each position inherits its portfolio's recalculated
 * performance, so this covers both the current-date position
 * calculations and the current-date portfolio calculations.
 */
export const dailyPerformanceCalculationJob = inngest.createFunction(
  {
    id: "daily-performance-calculation",
    triggers: eventType("performance/calculate.daily"),
    concurrency: { limit: 1 },
    idempotency: "performance-calc-daily:{{event.data.date}}",
    retries: RETRY_ATTEMPTS.dailyCalculation,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = assertPerformanceCalculateDaily(event.data);

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "daily-performance-calculation",
        eventType: "performance/calculate.daily",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: dailyCalculationIdempotencyKey(payload.date),
        maxRetries: RETRY_ATTEMPTS.dailyCalculation,
      }),
    );

    const portfolioIds = await step.run("resolve-portfolios", () =>
      resolveAllPortfolioIds(),
    );

    await step.sendEvent(
      "fanout-per-portfolio",
      portfolioIds.map((portfolioId) => ({
        name: "performance/calculate.requested",
        data: {
          id: `daily-${payload.date}-${portfolioId}`,
          portfolioId,
          period: "date",
          anchor: payload.date,
        },
      })),
    );

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, {
        date: payload.date,
        portfolios: portfolioIds.length,
        sentEvents: portfolioIds.length,
      }),
    );

    return { date: payload.date, portfolios: portfolioIds.length };
  },
);
