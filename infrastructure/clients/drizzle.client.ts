import type {
  HTTPQueryOptions,
  NeonQueryFunction,
} from "@neondatabase/serverless";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import {
  accountRelations,
  applicationRelations,
  auditLogRelations,
  bankAccountRelations,
  bankRelations,
  benchmarkHistoryRelations,
  benchmarkRelations,
  categoryRelations,
  checkingAccountRelations,
  cvmImportRelations,
  fundRelations,
  normRelations,
  normsPortfoliosRelations,
  portfolioPerformanceRelations,
  portfolioRelations,
  positionPerformanceRelations,
  positionRelations,
  quotaImportRelations,
  quotaRelations,
  sessionRelations,
  statementRelations,
  transactionAllocationRelations,
  userRelations,
  withdrawalRelations,
} from "@/infrastructure/database/relations";

/**
 * The request timeout, in milliseconds.
 *
 * Each HTTP request to the Neon database is aborted after this budget
 * elapses so that a stalled request fails fast instead of hanging the
 * calling serverless function.
 *
 * The default is generous because *Neon* serverless computes can be
 * autosuspended while idle and wake on demand; a suspended compute may take
 * several seconds to become ready, so a short budget turns legitimate cold
 * starts into failures. Override with `DATABASE_REQUEST_TIMEOUT_MS` when a
 * tighter budget is desired.
 *
 * The timeout applies to a freshly-created signal for **each** request (see
 * {@link createTimeoutAwareNeonClient}); it does not time the client's
 * lifetime.
 */
const REQUEST_TIMEOUT_MS =
  Number(process.env.DATABASE_REQUEST_TIMEOUT_MS) || 30_000;

/**
 * The configured *Neon* connection string from the environment.
 *
 * @remarks
 * The module fails fast if `DATABASE_URL` is missing so that a missing
 * environment variable never produces a partially-configured client.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * Build a *Neon* query function that attaches a fresh timeout signal to
 * every call.
 *
 * `AbortSignal.timeout()` aborts a stated number of milliseconds after the
 * signal is **created**. A single signal created at module load therefore
 * poisons every later request once its budget elapses: in a long-lived
 * process (e.g. `next dev`) that budget starts at load time, not at request
 * time, so all subsequent database calls fail instantly with a
 * `TimeoutError`. Recreating the signal per call keeps the timeout scoped to
 * a single request.
 *
 * The returned function preserves the parts of the `neon()` API used by the
 * *Drizzle* adapter (`query`, and structurally the tagged-template call,
 * `unsafe` and `transaction`).
 *
 * @param connectionString - The *Neon* connection string.
 * @returns A `neon()`-compatible query function with per-request timeouts.
 */
function createTimeoutAwareNeonClient(
  connectionString: string,
): NeonQueryFunction<boolean, boolean> {
  const RAW = neon<boolean, boolean>(connectionString);

  const CLIENT = Object.assign(
    (strings: TemplateStringsArray, ...params: unknown[]) =>
      RAW(strings, ...params),
    {
      query: (
        queryString: string,
        params: readonly unknown[] = [],
        options: HTTPQueryOptions<boolean, boolean> = {},
      ) =>
        RAW.query(queryString, params as unknown[], {
          ...options,
          fetchOptions: {
            ...options.fetchOptions,
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          },
        }),
      unsafe: RAW.unsafe,
      transaction: RAW.transaction,
    },
  );

  return CLIENT as unknown as NeonQueryFunction<boolean, boolean>;
}

/**
 * Create and export the shared *Drizzle* database client.
 *
 * The client connects to the Neon database using the
 * `DATABASE_URL` environment variable via the HTTP driver, which is
 * suited to serverless/edge runtimes.
 *
 * This is the single shared `db` instance used across the application,
 * including by the *Better Auth* adapter.
 */
export const db = drizzle({
  client: createTimeoutAwareNeonClient(connectionString),
  relations: {
    ...userRelations,
    ...accountRelations,
    ...sessionRelations,
    ...bankRelations,
    ...bankAccountRelations,
    ...checkingAccountRelations,
    ...fundRelations,
    ...quotaRelations,
    ...quotaImportRelations,
    ...cvmImportRelations,
    ...categoryRelations,
    ...portfolioRelations,
    ...positionRelations,
    ...applicationRelations,
    ...withdrawalRelations,
    ...transactionAllocationRelations,
    ...normRelations,
    ...normsPortfoliosRelations,
    ...benchmarkRelations,
    ...benchmarkHistoryRelations,
    ...auditLogRelations,
    ...portfolioPerformanceRelations,
    ...positionPerformanceRelations,
    ...statementRelations,
  },
});
