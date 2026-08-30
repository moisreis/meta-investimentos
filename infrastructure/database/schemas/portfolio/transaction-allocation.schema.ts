import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { application } from "./application.schema";
import { withdrawal } from "./withdrawal.schema";

/**
 * Defines the `transaction_allocation` table within the `portfolio`
 * database schema.
 *
 * The table stores how the quotas of an application are consumed by
 * one or more withdrawals, ensuring each application/withdrawal pair
 * is allocated at most once.
 */
export const transactionAllocation = pgSchema("portfolio").table(
  "transaction_allocation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => application.id),
    withdrawId: uuid("withdraw_id")
      .notNull()
      .references(() => withdrawal.id),
    quotasConsumed: numeric("quotas_consumed").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * Enforces that an application/withdrawal pair is allocated
     * at most once.
     */
    uniqueIndex("transaction_allocation_application_withdraw_uidx").on(
      table.applicationId,
      table.withdrawId,
    ),

    /**
     * Speeds up lookups of allocations by their application.
     */
    index("transaction_allocation_application_id_idx").on(table.applicationId),

    /**
     * Speeds up lookups of allocations by their withdrawal.
     */
    index("transaction_allocation_withdraw_id_idx").on(table.withdrawId),
  ],
);
