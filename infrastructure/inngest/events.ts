import type { ReferencePeriod } from "@/business/date-policy";

/**
 * The payload of a `cvm/import.requested` event.
 *
 * The user-facing entry point of an on-demand CVM import. The payload
 * carries a caller-generated `id` that is folded into the idempotency
 * key so re-firing the same logical request de-duplicates in a 24 hour
 * window while a distinct request id always starts a new run.
 */
export type CvmImportRequestedPayload = {
  id: string;
  monthsBack?: number;
  requestedStart?: string;
  requestedEnd?: string;
  requestedCnpjs?: string[];
};

/**
 * The payload of a `cvm/import.fund.requested` event.
 *
 * A single-fund import run spawned by the `cvm/import.requested`
 * orchestrator or by the nightly quote refresh. Each event carries the
 * parent request `id` and a single fund CNPJ so the per-fund concurrency
 * key can serialize imports touching the same fund.
 */
export type CvmImportFundRequestedPayload = {
  id: string;
  fundCnpj: string;
  monthsBack?: number;
  requestedStart?: string;
  requestedEnd?: string;
};

/**
 * The payload of a `fund/refresh.quotes` event.
 *
 * Refreshes the latest CVM quota data for every tracked fund (or the
 * provided subset). When no `date` is provided the refresh covers the
 * most recent months that are likely to have a published CVM file.
 */
export type FundQuoteRefreshPayload = {
  date?: string;
  requestedCnpjs?: string[];
};

/**
 * The payload of a `benchmark/refresh.requested` event.
 *
 * Asked to refresh the benchmark series used by performance analysis
 * (IPCA, CDI, IBOV). The optional range bounds the refresh window; when
 * omitted the refresh covers the period since the last recorded history.
 */
export type BenchmarkRefreshPayload = {
  startDate?: string;
  endDate?: string;
};

/**
 * The payload of a `performance/calculate.requested` event.
 *
 * Recalculates a single portfolio for one canonical reference period.
 * The `period` mirrors the `ReferenceDatePolicy` periods:
 * `"date"`, `"month"`, `"year-to-date"`, `"trailing-12m"` or `"range"`
 * (with `endDate` when a range).
 */
export type PerformanceCalculateRequestedPayload = {
  id: string;
  portfolioId: string;
  period: ReferencePeriod | "range";
  anchor: string;
  endDate?: string;
  businessDay?: boolean;
};

/**
 * The payload of a `performance/calculate.daily` event.
 *
 * The nightly roll-up: recalculates the current-date performance of
 * every portfolio (and therefore of every position). The orchestrator
 * fans out one `performance/calculate.requested` number of portfolios.
 * The `date` anchors the current-date period and the idempotency key.
 */
export type PerformanceCalculateDailyPayload = {
  date: string;
};

/**
 * The payload of a `job/retry.requested` event.
 *
 * Re-fires the failed job runs recorded in the durable job-run ledger so
 * they can recover without waiting for the next schedule. The `date`
 * anchors the idempotency key of the sweep.
 */
export type RetryFailedJobsPayload = {
  date: string;
  limit?: number;
};

/**
 * The payload of a `job/health.check` event.
 *
 * Runs the data-health scan over imports, job runs and tracked funds.
 * The `date` anchors the idempotency key of the scan.
 */
export type JobHealthCheckPayload = {
  date: string;
};

/**
 * The canonical event contract record bound to the {link Inngest} client.
 *
 * Every event name maps to the payload of the event. Type aliases are
 * used instead of interfaces because the record is checked against
 * `Record<string, { data: Record<string, unknown> }>` and type aliases
 * (unlike closed interfaces) are assignable to a record index signature.
 */
export const events = {
  "cvm/import.requested": { data: {} as CvmImportRequestedPayload },
  "cvm/import.fund.requested": { data: {} as CvmImportFundRequestedPayload },
  "fund/refresh.quotes": { data: {} as FundQuoteRefreshPayload },
  "benchmark/refresh.requested": { data: {} as BenchmarkRefreshPayload },
  "performance/calculate.requested": {
    data: {} as PerformanceCalculateRequestedPayload,
  },
  "performance/calculate.daily": {
    data: {} as PerformanceCalculateDailyPayload,
  },
  "job/retry.requested": { data: {} as RetryFailedJobsPayload },
  "job/health.check": { data: {} as JobHealthCheckPayload },
} as const satisfies Record<string, { data: Record<string, unknown> }>;

/**
 * The union of every event name handled by this application.
 */
export type EventName = keyof typeof events;
