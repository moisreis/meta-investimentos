import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core"

// Stores the fund categories on the platform.
// Each category has a unique name used to group funds.
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
})
