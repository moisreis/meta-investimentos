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

export async function resetDatabase(): Promise<void> {
  const TABLE_LIST = TABLES.join(", ");

  await db.execute(
    sql.raw(`TRUNCATE TABLE ${TABLE_LIST} RESTART IDENTITY CASCADE`),
  );
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
