import {
  index,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { category } from "../fund/category.schema";

/**
 * Defines the `norm` table within the `portfolio` database schema.
 *
 * The table stores the allocation norms applicable to a fund
 * category, each with its own minimum, maximum, and target
 * allocation parameters.
 */
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Speeds up lookups of norms by their category.
     */
    index("norm_category_id_idx").on(table.categoryId),
  ],
);
