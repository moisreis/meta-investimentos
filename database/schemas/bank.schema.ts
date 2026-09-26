import {
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

// Stores the financial institutions on the platform.
// Each bank carries a unique code and a display name.
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
})
