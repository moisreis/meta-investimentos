import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Defines the `job_run` table within the `job` database schema.
 *
 * The table records a single durable job run — an import or a
 * calculation executed through *Inngest*. Besides the lifecycle
 * timestamps and status it keeps the idempotency key used to de-dupe the
 * triggering event, the retry budget, the current progress percentage,
 * the JSON result summary and the failure details, so every run can be
 * audited, resumed by the nightly retry sweep or inspected by the
 * data-health checks.
 */
export const jobRun = pgSchema("job").table(
  "job_run",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobName: text("job_name").notNull(),
    status: text("status").notNull().default("PENDING"),
    eventType: text("event_type").notNull(),
    eventPayload: jsonb("event_payload").notNull(),
    idempotencyKey: text("idempotency_key"),
    progress: integer("progress").notNull().default(0),
    resultSummary: jsonb("result_summary"),
    errorMessage: text("error_message"),
    errorStack: text("error_stack"),
    retriesRemaining: integer("retries_remaining").notNull().default(0),
    maxRetries: integer("max_retries").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    /**
     * Restricts the run status to the supported lifecycle states.
     */
    check(
      "job_run_status_check",
      sql`${table.status} in ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')`,
    ),

    /**
     * Keeps the progress percentage inside its valid range.
     */
    check("job_run_progress_check", sql`${table.progress} between 0 and 100`),

    /**
     * Speeds up the status-driven workers (retry sweep, data-health).
     */
    index("job_run_status_idx").on(table.status),

    /**
     * Speeds up idempotency lookups when events are de-duplicated.
     */
    index("job_run_idempotency_key_idx").on(table.idempotencyKey),

    /**
     * Speeds up finish-date based reporting.
     */
    index("job_run_finished_at_idx").on(table.finishedAt),
  ],
);
