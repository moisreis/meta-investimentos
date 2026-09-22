import { sql } from "drizzle-orm"
import {
  index,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { user } from "@db-schemas/user.schema"

// Stores the authentication accounts linked to a user.
// Keeps the credentials and tokens per authentication provider.
export const account = pgSchema("user").table(
  "account",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
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
    // Enforces that each user may link a given provider account
    // at most once.
    uniqueIndex("account_providerId_accountId_uidx").on(
      table.providerId,
      table.accountId
    ),

    // Speeds up lookups of accounts by their owning user.
    index("account_userId_idx").on(table.userId),
  ]
)
