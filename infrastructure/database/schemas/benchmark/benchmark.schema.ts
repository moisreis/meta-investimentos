import {
  index,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Defines the `benchmark` table within the `benchmark` database schema.
 *
 * The table stores the market benchmarks used to measure fund and
 * portfolio performance, each uniquely identified by its acronym and
 * name pair.
 */
export const benchmark = pgSchema("benchmark").table(
  "benchmark",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    acronym: text("acronym").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * Enforces that a given acronym/name pair is registered
     * at most once.
     */
    uniqueIndex("benchmark_acronym_name_uidx").on(table.acronym, table.name),

    /**
     * Speeds up lookups of benchmarks by their acronym.
     */
    index("benchmark_acronym_idx").on(table.acronym),
  ],
);
