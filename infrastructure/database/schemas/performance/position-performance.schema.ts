import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { position } from "../portfolio/position.schema";

/**
 * Defines the `position_performance` table within the `performance`
 * database schema.
 *
 * The table stores the daily performance snapshot of a position,
 * with a single record per date, including return metrics and the
 * position allocation within its portfolio.
 */
export const positionPerformance = pgSchema("performance").table(
  "position_performance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    positionId: uuid("position_id")
      .notNull()
      .references(() => position.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    quotasHeld: numeric("quotas_held", { precision: 18, scale: 6 }).notNull(),
    patrimony: numeric("patrimony", { precision: 18, scale: 6 }).notNull(),
    applicationTotal: numeric("application_total", {
      precision: 18,
      scale: 6,
    }).notNull(),
    redemptionTotal: numeric("redemption_total", {
      precision: 18,
      scale: 6,
    }).notNull(),
    cashFlowNet: numeric("cash_flow_net", {
      precision: 18,
      scale: 6,
    }).notNull(),
    earnings: numeric("earnings", { precision: 18, scale: 6 }).notNull(),
    returnDaily: numeric("return_daily").notNull(),
    returnMonthly: numeric("return_monthly"),
    returnYearly: numeric("return_yearly"),
    returnLast12m: numeric("return_last_12m"),
    allocation: numeric("allocation").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    /**
     * Enforces that a position holds a single performance record
     * per date.
     */
    uniqueIndex("position_performance_position_date_uidx").on(
      table.positionId,
      table.date,
    ),

    /**
     * Speeds up lookups of performance records by their full key.
     */
    index("position_performance_position_date_idx").on(
      table.positionId,
      table.date,
    ),
  ],
);
