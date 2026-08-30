import {
  date,
  index,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { portfolio } from "../portfolio/portfolio.schema";
import { user } from "../user/user.schema";

/**
 * Defines the `statement` table within the `report` database schema.
 *
 * The table stores the reporting statements generated for a
 * portfolio over a date period, optionally attributed to the user
 * who generated the report.
 */
export const statement = pgSchema("report").table(
  "statement",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id").references(() => portfolio.id),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),
    fileUrl: text("file_url").notNull(),
    generatedByUserId: uuid("generated_by_user_id").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * Speeds up lookups of statements by their portfolio and period.
     */
    index("statement_portfolio_period_idx").on(
      table.portfolioId,
      table.periodStart,
      table.periodEnd,
    ),

    /**
     * Speeds up lookups of statements by the user who generated them.
     */
    index("statement_generated_by_user_id_idx").on(table.generatedByUserId),
  ],
);
