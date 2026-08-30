import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { benchmark } from "./benchmark.schema";

/**
 * Defines the `benchmark_history` table within the `benchmark`
 * database schema.
 *
 * The table stores the daily rates of a benchmark, with a single
 * rate record per date.
 */
export const benchmarkHistory = pgSchema("benchmark").table(
  "benchmark_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    benchmarkId: uuid("benchmark_id")
      .notNull()
      .references(() => benchmark.id),
    date: timestamp("date").notNull(),
    rate: numeric("rate").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * Enforces that a benchmark holds a single rate per date.
     */
    uniqueIndex("benchmark_history_benchmark_date_uidx").on(
      table.benchmarkId,
      table.date,
    ),

    /**
     * Speeds up lookups of history records by their benchmark.
     */
    index("benchmark_history_benchmark_id_idx").on(table.benchmarkId),
  ],
);
