import type { DbClient } from "@/infrastructure/repositories/types";

import type { IJobRunLedger } from "./job-run.ledger.contracts";
import { createJobRunLedger } from "./job-run.ledger.contracts";

/**
 * Resolves the application-wide {@link IJobRunLedger}.
 *
 * The database client and the job-run repository are loaded lazily so
 * importing this module never requires a `DATABASE_URL`; the connection
 * is only opened when a worker actually writes a run record. This keeps
 * the function definitions introspectable in unit tests and runs fine on
 * serverless runtimes.
 *
 * @returns A promise resolving to the shared ledger.
 */
export async function getJobRunLedger(): Promise<IJobRunLedger> {
  const db = await resolveDb();
  const [{ JobRunRepository }] = await Promise.all([
    import("@/infrastructure/repositories/inngest/job-run.repository"),
  ]);

  return createJobRunLedger(new JobRunRepository(db));
}

/**
 * The cached database client shared by every ledger write.
 */
let cachedDb: DbClient | undefined;

/**
 * Resolves and caches the shared database client.
 *
 * @returns A promise resolving to the database client.
 */
async function resolveDb(): Promise<DbClient> {
  if (!cachedDb) {
    const MODULE = await import("@/infrastructure/clients/drizzle.client");
    cachedDb = MODULE.db;
  }
  return cachedDb;
}
