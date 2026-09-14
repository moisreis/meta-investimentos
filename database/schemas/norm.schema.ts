import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { category } from "@db-schemas/category.schema";

// Defines the `norm` table in the `portfolio` database schema.
// Stores allocation norms per fund category.
export const norm = pgSchema("portfolio").table(
  "norm",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleNumber: text("article_number").notNull(),
    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => category.id),
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
    version: integer("version").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Enforces the ordering: min ≤ target ≤ max.
    check(
      "norm_allocation_order",
      sql`${table.minAllocation} <= ${table.targetAllocation} AND ${table.targetAllocation} <= ${table.maxAllocation}`,
    ),

    // Speeds up lookups of norms by their category.
    index("norm_category_id_idx").on(table.categoryId),
  ],
);
