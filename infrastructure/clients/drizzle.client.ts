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
  fundRelations,
  normRelations,
  normsPortfoliosRelations,
  portfolioPerformanceRelations,
  portfolioRelations,
  positionPerformanceRelations,
  positionRelations,
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
 */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Create and export the shared *Drizzle* database client.
 *
 * The client connects to the Neon database using the
 * `DATABASE_URL` environment variable via the HTTP driver, which is
 * suited to serverless/edge runtimes.
 *
 * This is the single shared `db` instance used across the application,
 * including by the *Better Auth* adapter.
 *
 * @remarks
 * The module fails fast if `DATABASE_URL` is missing so that a missing
 * environment variable never produces a partially-configured client.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle({
  connection: {
    connectionString,
    fetchOptions: {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  },
  relations: {
    ...userRelations,
    ...accountRelations,
    ...sessionRelations,
    ...bankRelations,
    ...bankAccountRelations,
    ...checkingAccountRelations,
    ...fundRelations,
    ...quotaRelations,
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
