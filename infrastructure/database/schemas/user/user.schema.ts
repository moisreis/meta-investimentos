import { sql } from "drizzle-orm";
import { boolean, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { userRole } from "./user-role.enum";

/**
 * Defines the `user` table within the `user` database schema.
 *
 * The table stores the platform's registered users, holding
 * authentication profile data such as the verified email address
 * and an optional profile image.
 */
export const user = pgSchema("user").table("user", {
  /**
   * Stores the *Better Auth* generated id, an opaque 32-character string;
   * `text` because it is not a UUID. Direct inserts fall back to a
   * UUID-formatted string via `gen_random_uuid()::text`.
   */
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
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
});
