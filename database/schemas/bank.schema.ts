import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Defines the `bank` table in the `bank` database schema.
// Stores financial institutions, each with a unique bank code.
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
