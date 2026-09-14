import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Defines the `category` table in the `fund` database schema.
// Stores fund categories, each with a unique name.
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
