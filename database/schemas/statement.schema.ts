import {
  date,
  index,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { portfolio } from "@db-schemas/portfolio.schema";
import { user } from "@db-schemas/user.schema";

// Defines the `statement` table in the `report` database schema.
// Stores the reporting statements generated for a portfolio.
export const statement = pgSchema("report").table(
  "statement",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id").references(() => portfolio.id),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),
    fileUrl: text("file_url").notNull(),
    generatedByUserId: text("generated_by_user_id").references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Speeds up lookups of statements by portfolio and period.
    index("statement_portfolio_period_idx").on(
      table.portfolioId,
      table.periodStart,
      table.periodEnd,
    ),

    // Speeds up lookups of statements by the generating user.
    index("statement_generated_by_user_id_idx").on(table.generatedByUserId),
  ],
);
