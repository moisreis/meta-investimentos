import type {
  CvmImportRequestedPayload,
  PerformanceCalculateRequestedPayload,
} from "./events";

/**
 * Builds a stable, bounded-length hash string from a set of string
 * parts.
 *
 * The hash keeps idempotency and concurrency keys deterministic and
 * short (for example a sorted CNPJ list), and stays stable across runs
 * because it only depends on the provided values.
 *
 * @param parts - The values to fold into the hash.
 * @returns The base-36 hash string.
 */
export function hashInputKey(parts: (string | number | undefined)[]): string {
  const VALUE = parts
    .filter((part): part is string | number => part !== undefined)
    .join("|");
  let hash = 5381;
  for (let index = 0; index < VALUE.length; index += 1) {
    hash = ((hash << 5) + hash + VALUE.charCodeAt(index)) | 0;
  }
  return (hash >>> 0).toString(36);
}

/**
 * Builds the idempotency key of an on-demand CVM import request.
 *
 * The scope (month lookback and date window) plus the requested CNPJs
 * are folded into the key, so firing the exact same request twice within
 * a 24 hour window de-duplicates, while a freshly generated request id
 * always schedules a new run.
 *
 * @param payload - The import request payload.
 * @returns The idempotency key.
 */
export function cvmImportIdempotencyKey(
  payload: CvmImportRequestedPayload,
): string {
  const CNPJS = [...(payload.requestedCnpjs ?? [])].sort().join(",");
  return `cvm-import:${payload.id}:${payload.monthsBack ?? ""}:${
    payload.requestedStart ?? ""
  }:${payload.requestedEnd ?? ""}:${hashInputKey([CNPJS])}`;
}

/**
 * Builds the idempotency key of a single-fund import run.
 *
 * The parent request `id` and the fund CNPJ identify the run.
 *
 * @param parentRequestId - The id of the orchestrating import request.
 * @param fundCnpj - The CNPJ of the fund being imported.
 * @returns The idempotency key.
 */
export function cvmImportFundIdempotencyKey(
  parentRequestId: string,
  fundCnpj: string,
): string {
  return `cvm-import-fund:${parentRequestId}:${fundCnpj}`;
}

/**
 * Builds the idempotency key of a scheduled fund quote refresh.
 *
 * @param date - The reference date of the refresh, or `undefined` for
 *   the default latest-months sweep.
 * @param requestedCnpjs - The optional subset of fund CNPJs refreshed.
 * @returns The idempotency key.
 */
export function fundQuoteRefreshIdempotencyKey(
  date?: string,
  requestedCnpjs?: string[],
): string {
  const CNPJS = [...(requestedCnpjs ?? [])].sort().join(",");
  return `fund-quote-refresh:${date ?? "latest"}:${hashInputKey([CNPJS])}`;
}

/**
 * Builds the idempotency key of a benchmark refresh request.
 *
 * @param payload - The benchmark refresh payload.
 * @returns The idempotency key.
 */
export function benchmarkRefreshIdempotencyKey(payload: {
  startDate?: string;
  endDate?: string;
}): string {
  return `benchmark-refresh:${payload.startDate ?? ""}:${
    payload.endDate ?? ""
  }`;
}

/**
 * Builds the idempotency key of a portfolio recalculation request.
 *
 * The request `id`, the portfolio and the resolved reference period
 * identify the run, so replaying the same request de-duplicates while a
 * distinct request id always recalculates again.
 *
 * @param payload - The calculation request payload.
 * @returns The idempotency key.
 */
export function performanceCalculateIdempotencyKey(
  payload: PerformanceCalculateRequestedPayload,
): string {
  return `performance-calc:${payload.id}:${payload.portfolioId}:${
    payload.period
  }:${payload.anchor}:${payload.endDate ?? ""}:${payload.businessDay ?? false}`;
}

/**
 * Builds the idempotency key of the nightly calculation roll-up.
 *
 * @param date - The `YYYY-MM-DD` reference date being calculated.
 * @returns The idempotency key.
 */
export function dailyCalculationIdempotencyKey(date: string): string {
  return `performance-calc-daily:${date}`;
}

/**
 * Builds the idempotency key of the nightly benchmark refresh.
 *
 * @param date - The `YYYY-MM-DD` reference date.
 * @returns The idempotency key.
 */
export function dailyBenchmarkIdempotencyKey(date: string): string {
  return `benchmark-refresh-daily:${date}`;
}

/**
 * Builds the idempotency key of the nightly failed-job retry sweep.
 *
 * @param date - The `YYYY-MM-DD` reference date.
 * @returns The idempotency key.
 */
export function retryFailedJobsIdempotencyKey(date: string): string {
  return `job-retry:${date}`;
}

/**
 * Builds the idempotency key of the nightly data-health check.
 *
 * @param date - The `YYYY-MM-DD` reference date.
 * @returns The idempotency key.
 */
export function dataHealthCheckIdempotencyKey(date: string): string {
  return `job-health:${date}`;
}

/**
 * Builds a unique event id that is safe to fold into idempotency keys.
 *
 * @returns A `v4`-shaped UUID string when the runtime provides one,
 *   otherwise a timestamp/random fallback.
 */
export function newRequestId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
