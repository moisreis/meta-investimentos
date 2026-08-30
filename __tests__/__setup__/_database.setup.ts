import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";

config({ path: ".env.test" });

if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    "TEST_DATABASE_URL is not set. Make sure .env.test points at the Neon test branch.",
  );
}

const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });

export const db = drizzle({ client: pool });

/**
 * Test tables to wipe between tests, listed child-first in foreign key
 * order so the truncate still succeeds if CASCADE were ever removed.
 *
 * CASCADE is kept as a safety net for any relation not listed here.
 */
const TABLES = [
  '"audit"."audit_log"',
  '"bank"."bank_account"',
  '"bank"."checking_account"',
  '"bank"."bank"',
  '"benchmark"."benchmark_history"',
  '"benchmark"."benchmark"',
  '"fund"."quota"',
  '"fund"."fund"',
  '"fund"."category"',
  '"performance"."portfolio_performance"',
  '"performance"."position_performance"',
  '"portfolio"."transaction_allocation"',
  '"portfolio"."application"',
  '"portfolio"."withdrawal"',
  '"portfolio"."norms_portfolios"',
  '"portfolio"."position"',
  '"portfolio"."norm"',
  '"portfolio"."portfolio"',
  '"report"."statement"',
  '"user"."verification"',
  '"user"."session"',
  '"user"."account"',
  '"user"."user"',
] as const;

/**
 * Wipes all test tables and resets identity sequences. Safe to call
 * both before and after a test — idempotent on an already-empty DB.
 */
export async function resetDatabase(): Promise<void> {
  const TABLE_LIST = TABLES.join(", ");

  await db.execute(
    sql.raw(`TRUNCATE TABLE ${TABLE_LIST} RESTART IDENTITY CASCADE`),
  );
}

/**
 * Closes the pool. Call once in `afterAll` at the end of the test
 * file/suite — not per test — otherwise later tests will fail to
 * connect.
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}
