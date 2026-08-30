import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { bankAccount } from "./bank-account.schema";

/**
 * Defines the `checking_account` table within the `bank` database
 * schema.
 *
 * The table stores the daily balance of a bank account, with a single
 * record per date.
 */
export const checkingAccount = pgSchema("bank").table(
  "checking_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bankAccountId: uuid("bank_account_id")
      .notNull()
      .references(() => bankAccount.id),
    date: timestamp("date").notNull(),
    value: numeric("value").notNull(),
  },
  (table) => [
    /**
     * Enforces that a bank account holds a single balance per date.
     */
    uniqueIndex("checking_account_bank_account_date_uidx").on(
      table.bankAccountId,
      table.date,
    ),

    /**
     * Speeds up lookups of checking account records by their full key.
     */
    index("checking_account_bank_account_date_idx").on(
      table.bankAccountId,
      table.date,
    ),
  ],
);
