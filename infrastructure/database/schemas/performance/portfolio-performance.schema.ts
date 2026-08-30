import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { portfolio } from "../portfolio/portfolio.schema";

/**
 * Defines the `portfolio_performance` table within the `performance`
 * database schema.
 *
 * The table stores the daily performance snapshot of a portfolio,
 * with a single record per date, including return and benchmark
 * spread metrics.
 */
export const portfolioPerformance = pgSchema("performance").table(
  "portfolio_performance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolio.id),
    date: timestamp("date").notNull(),
    quotasHeld: numeric("quotas_held").notNull(),
    patrimony: numeric("patrimony").notNull(),
    applicationTotal: numeric("application_total").notNull(),
    redemptionTotal: numeric("redemption_total").notNull(),
    cashFlowNet: numeric("cash_flow_net").notNull(),
    earnings: numeric("earnings").notNull(),
    returnDaily: numeric("return_daily").notNull(),
    returnMonthly: numeric("return_monthly"),
    returnYearly: numeric("return_yearly"),
    returnLast12m: numeric("return_last_12m"),
    target: numeric("target"),
    cumulativeTarget: numeric("cumulative_target"),
    inflationSpread: numeric("inflation_spread"),
    riskFreeSpread: numeric("risk_free_spread"),
    marketSpread: numeric("market_spread"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * Enforces that a portfolio holds a single performance record
     * per date.
     */
    uniqueIndex("portfolio_performance_portfolio_date_uidx").on(
      table.portfolioId,
      table.date,
    ),

    /**
     * Speeds up lookups of performance records by their full key.
     */
    index("portfolio_performance_portfolio_date_idx").on(
      table.portfolioId,
      table.date,
    ),
  ],
);
