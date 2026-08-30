import {
  index,
  numeric,
  pgSchema,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { norm } from "./norm.schema";
import { portfolio } from "./portfolio.schema";

/**
 * Defines the `norms_portfolios` table within the `portfolio`
 * database schema.
 *
 * The table links portfolios to the norms that apply to them, with
 * per-portfolio allocation overrides. Each norm/portfolio pair is
 * uniquely identified by its composite primary key.
 */
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.normId, table.portfolioId],
    }),

    /**
     * Speeds up lookups of norm/portfolio links by their portfolio.
     */
    index("norms_portfolios_portfolio_id_idx").on(table.portfolioId),

    /**
     * Speeds up lookups of norm/portfolio links by their norm.
     */
    index("norms_portfolios_norm_id_idx").on(table.normId),
  ],
);
