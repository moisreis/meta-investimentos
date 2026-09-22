import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { position } from "@db-schemas/position.schema"

// Stores the daily performance snapshot of a position.
// Holds quotas, returns, and the allocation share for the day.
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
    // Enforces that a position holds a single performance record
    // per date.
    uniqueIndex("position_performance_position_date_uidx").on(
      table.positionId,
      table.date
    ),

    // Speeds up lookups of performance records by the full key.
    index("position_performance_position_date_idx").on(
      table.positionId,
      table.date
    ),
  ]
)
