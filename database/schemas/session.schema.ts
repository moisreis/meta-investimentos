import { sql } from "drizzle-orm";
import { index, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@db-schemas/user.schema";

// Defines the `session` table in the `user` database schema.
// Stores the authentication sessions issued to users.
export const session = pgSchema("user").table(
  "session",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Speeds up lookups of sessions by their owning user.
    index("session_userId_idx").on(table.userId),
  ],
);
