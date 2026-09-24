import { sql } from "drizzle-orm"
import { boolean, pgSchema, text, timestamp } from "drizzle-orm/pg-core"
import { userRole } from "@db-schemas/user-role.enum"

// Stores the registered users of the platform.
// Carries the identity data, the **CPF**, and the role.
export const user = pgSchema("user").table("user", {
  // **Better-Auth** generated id, an opaque 32-character string
  // rather than a UUID. Falls back to gen_random_uuid()::text.
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),
  name: text("name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  cpf: text("cpf").notNull().unique(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRole("role").default("USER").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})
