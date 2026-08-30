import { boolean, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userRole } from "./user-role.enum";

/**
 * Defines the `user` table within the `user` database schema.
 *
 * The table stores the platform's registered users, holding
 * authentication profile data such as the verified email address
 * and an optional profile image.
 */
export const user = pgSchema("user").table("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  cpf: text("cpf").notNull().unique(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRole("role").default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
