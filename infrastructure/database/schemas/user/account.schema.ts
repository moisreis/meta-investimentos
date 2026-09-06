import { sql } from "drizzle-orm";
import {
  index,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

/**
 * Defines the `account` table within the `user` database schema.
 *
 * The table stores the authentication accounts linked to a user. Each
 * row represents an identity provider authorization, including the
 * email-and-password credential provider used by *Better Auth*.
 */
export const account = pgSchema("user").table(
  "account",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
    issuer: text("issuer").notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Enforces that each user may link a given provider account
     * at most once.
     */
    uniqueIndex("account_issuer_accountId_uidx").on(
      table.issuer,
      table.accountId,
    ),

    /**
     * Speeds up lookups of accounts by their owning user.
     */
    index("account_userId_idx").on(table.userId),
  ],
);
