import {
  index,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { bank } from "../bank/bank.schema";
import { benchmark } from "../benchmark/benchmark.schema";
import { category } from "./category.schema";

/**
 * Defines the `fund` table within the `fund` database schema.
 *
 * The table stores the investment funds available on the platform,
 * including the optional administrative and performance fees, the
 * issuing bank, and the optional benchmark and category.
 */
export const fund = pgSchema("fund").table(
  "fund",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cnpj: text("cnpj").notNull().unique(),
    name: text("name").notNull(),
    administrationFee: numeric("administration_fee"),
    performanceFee: numeric("performance_fee"),
    bankId: uuid("bank_id")
      .notNull()
      .references(() => bank.id),
    benchmarkId: uuid("benchmark_id").references(() => benchmark.id),
    categoryId: uuid("category_id").references(() => category.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Speeds up lookups of funds by their issuing bank.
     */
    index("fund_bank_id_idx").on(table.bankId),

    /**
     * Speeds up lookups of funds by their benchmark.
     */
    index("fund_benchmark_id_idx").on(table.benchmarkId),

    /**
     * Speeds up lookups of funds by their category.
     */
    index("fund_category_id_idx").on(table.categoryId),
  ],
);
