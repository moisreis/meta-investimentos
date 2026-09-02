import { index, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

/**
 * Defines the `session` table within the `user` database schema.
 *
 * The table stores the authentication sessions issued to users,
 * including the opaque session token and the metadata of the request
 * that created the session.
 */
export const session = pgSchema("user").table(
  "session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
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
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    /**
     * Speeds up lookups of sessions by their owning user.
     */
    index("session_userId_idx").on(table.userId),
  ],
);
