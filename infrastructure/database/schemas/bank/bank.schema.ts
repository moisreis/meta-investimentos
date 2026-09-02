import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Defines the `bank` table within the `bank` database schema.
 *
 * The table stores the financial institutions on the platform, each
 * uniquely identified by its bank code.
 */
export const bank = pgSchema("bank").table("bank", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
