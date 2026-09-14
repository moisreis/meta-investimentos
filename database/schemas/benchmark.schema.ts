import {
  index,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Defines the `benchmark` table in the `benchmark`
// database schema. Stores benchmarks with unique acronyms.
export const benchmark = pgSchema("benchmark").table(
  "benchmark",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    acronym: text("acronym").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Enforces that a given acronym/name pair is registered
    // at most once.
    uniqueIndex("benchmark_acronym_name_uidx").on(table.acronym, table.name),

    // Speeds up lookups of benchmarks by their acronym.
    index("benchmark_acronym_idx").on(table.acronym),
  ],
);
