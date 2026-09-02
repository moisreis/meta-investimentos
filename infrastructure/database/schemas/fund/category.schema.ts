import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Defines the `category` table within the `fund` database schema.
 *
 * The table stores the fund categories, each uniquely identified by
 * its name and used to group funds and regulatory norms.
 */
export const category = pgSchema("fund").table("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
