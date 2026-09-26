import {
  index,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { bank } from "@db-schemas/bank.schema"
import { benchmark } from "@db-schemas/benchmark.schema"
import { category } from "@db-schemas/category.schema"

// Stores the investment funds available on the platform.
// Carries the **CNPJ**, the fees, and the benchmark links.
export const fund = pgSchema("fund").table(
  "fund",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cnpj: text("cnpj").notNull().unique(),
    name: text("name").notNull(),
    administrationFee: numeric("administration_fee", {
      precision: 18,
      scale: 6,
    }),
    performanceFee: numeric("performance_fee", {
      precision: 18,
      scale: 6,
    }),
    bankId: uuid("bank_id")
      .notNull()
      .references(() => bank.id),
    benchmarkId: uuid("benchmark_id").references(
      () => benchmark.id
    ),
    categoryId: uuid("category_id").references(
      () => category.id
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Speeds up lookups of funds by their issuing bank.
    index("fund_bank_id_idx").on(table.bankId),

    // Speeds up lookups of funds by their benchmark.
    index("fund_benchmark_id_idx").on(table.benchmarkId),

    // Speeds up lookups of funds by their category.
    index("fund_category_id_idx").on(table.categoryId),
  ]
)
