import { eventType } from "inngest";
import { benchmarkRefreshIdempotencyKey } from "@/infrastructure/inngest/idempotency.utils";
import { inngest } from "@/infrastructure/inngest/inngest.provider";
import { getJobRunLedger } from "@/infrastructure/inngest/job-run.ledger.provider";
import { assertBenchmarkRefresh } from "@/infrastructure/inngest/payloads.contracts";
import { RETRY_ATTEMPTS } from "@/infrastructure/inngest/retry.utils";

/**
 * The benchmark acronyms the performance analysis relies on.
 */
const TRACKED_BENCHMARK_ACRONYMS = ["IPCA", "CDI", "IBOV"] as const;

/**
 * The freshness budget, in days, below which a benchmark history is
 * considered current.
 */
const BENCHMARK_FRESHNESS_DAYS = 45;

/**
 * The wall-clock milliseconds of one day.
 */
const DAY_MS = 86_400_000;

/**
 * The benchmark refresh worker.
 *
 * Receives a `benchmark/refresh.requested` event and verifies that the
 * tracked benchmark series (IPCA, CDI, IBOV) exist and carry a fresh
 * history point. Refreshing the live rates is a future provider job
 * behind this worker; today the worker reports the freshness state of
 * each acronym so data-health and day-to-day operations can see gaps.
 */
export const benchmarkRefreshJob = inngest.createFunction(
  {
    id: "benchmark-refresh",
    triggers: eventType("benchmark/refresh.requested"),
    concurrency: { limit: 1 },
    idempotency:
      "benchmark-refresh:{{event.data.startDate}}:{{event.data.endDate}}",
    retries: RETRY_ATTEMPTS.benchmarkRefresh,
  },
  async ({ event, step }) => {
    const ledger = await getJobRunLedger();
    const payload = assertBenchmarkRefresh(event.data);

    const run = await step.run("job-run.start", () =>
      ledger.start({
        jobName: "benchmark-refresh",
        eventType: "benchmark/refresh.requested",
        eventPayload: payload as unknown as Record<string, unknown>,
        idempotencyKey: benchmarkRefreshIdempotencyKey(payload),
        maxRetries: RETRY_ATTEMPTS.benchmarkRefresh,
      }),
    );

    const summary = await step.run("scan-benchmarks", async () => {
      const [{ db }, { BenchmarkRepository }, { BenchmarkHistoryRepository }] =
        await Promise.all([
          import("@/infrastructure/clients/drizzle.client"),
          import(
            "@/infrastructure/repositories/benchmark/benchmark.repository"
          ),
          import(
            "@/infrastructure/repositories/benchmark/benchmark-history.repository"
          ),
        ]);

      const BENCHMARKS = await new BenchmarkRepository(db).findAll();
      const BY_ACRONYM = new Map(
        BENCHMARKS.map((benchmark) => [benchmark.acronym, benchmark.id]),
      );
      const NOW = Date.now();

      const FRESHNESS: Record<string, string> = {};
      for (const acronym of TRACKED_BENCHMARK_ACRONYMS) {
        const BENCHMARK_ID = BY_ACRONYM.get(acronym);
        if (!BENCHMARK_ID) {
          FRESHNESS[acronym] = "missing";
          continue;
        }
        const HISTORIES = await new BenchmarkHistoryRepository(
          db,
        ).findAllByBenchmarkId(BENCHMARK_ID);
        if (HISTORIES.length === 0) {
          FRESHNESS[acronym] = "no-history";
          continue;
        }
        const LATEST = Math.max(...HISTORIES.map((h) => h.date.getTime()));
        const AGE_DAYS = Math.max(0, Math.floor((NOW - LATEST) / DAY_MS));
        FRESHNESS[acronym] =
          AGE_DAYS < BENCHMARK_FRESHNESS_DAYS
            ? `fresh-${AGE_DAYS}d`
            : `stale-${AGE_DAYS}d`;
      }

      return {
        requestedStart: payload.startDate,
        requestedEnd: payload.endDate,
        trackedAcronyms: [...TRACKED_BENCHMARK_ACRONYMS],
        freshness: FRESHNESS,
      };
    });

    await step.run("job-run.complete", () =>
      ledger.complete(run.runId, summary),
    );

    return summary;
  },
);
