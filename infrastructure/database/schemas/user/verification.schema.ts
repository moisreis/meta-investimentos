import { sql } from "drizzle-orm";
import { index, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Defines the `verification` table within the `user` database schema.
 *
 * The table stores the verification requests issued to users, such as
 * email address verification tokens or password reset requests.
 */
export const verification = pgSchema("user").table(
  "verification",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Speeds up lookups of verifications by their identifier.
     */
    index("verification_identifier_idx").on(table.identifier),
  ],
);
