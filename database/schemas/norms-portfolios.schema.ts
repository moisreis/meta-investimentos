import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgSchema,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { norm } from "@db-schemas/norm.schema";
import { portfolio } from "@db-schemas/portfolio.schema";

// Defines the `norms_portfolios` table in the `portfolio`
// database schema. Links portfolios and their applicable norms.
export const normsPortfolios = pgSchema("portfolio").table(
  "norms_portfolios",
  {
    normId: uuid("norm_id")
      .notNull()
      .references(() => norm.id, { onDelete: "cascade" }),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolio.id, { onDelete: "cascade" }),
    minAllocation: numeric("min_allocation", {
      precision: 5,
      scale: 2,
    }).notNull(),
    maxAllocation: numeric("max_allocation", {
      precision: 5,
      scale: 2,
    }).notNull(),
    targetAllocation: numeric("target_allocation", {
      precision: 5,
      scale: 2,
    }).notNull(),
    version: integer("version").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.normId, table.portfolioId],
    }),

    // Enforces the ordering: min ≤ target ≤ max.
    check(
      "norms_portfolios_allocation_order",
      sql`${table.minAllocation} <= ${table.targetAllocation} AND ${table.targetAllocation} <= ${table.maxAllocation}`,
    ),

    // Speeds up lookups of norm/portfolio links by portfolio.
    index("norms_portfolios_portfolio_id_idx").on(table.portfolioId),

    // Speeds up lookups of norm/portfolio links by their norm.
    index("norms_portfolios_norm_id_idx").on(table.normId),
  ],
);
