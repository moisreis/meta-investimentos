import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "@/infrastructure/clients/drizzle.client";
import { account } from "@/infrastructure/database/schemas/user/account.schema";
import { session } from "@/infrastructure/database/schemas/user/session.schema";
import { user } from "@/infrastructure/database/schemas/user/user.schema";
import { verification } from "@/infrastructure/database/schemas/user/verification.schema";

/**
 * Configure the *Better Auth* client and export the shared `auth` instance.
 *
 * The client is backed by the *Drizzle* database adapter so all
 * authentication records persist through the Neon/PostgreSQL connection.
 *
 * The adapter is given the `user`, `session`, `account`, and `verification`
 * tables so it can resolve the *Better Auth* models against the database;
 * running without a schema fails at initialization.
 *
 * Authentication is initialized with email-and-password enabled, which
 * provides sign-in, sign-up, and session management out of the box.
 *
 * `user.additionalFields` registers the profile columns that are *not* part
 * of the *Better Auth* core schema but are still NOT NULL on the `user`
 * table (`first_name`, `last_name`, `cpf`). Those fields are accepted from
 * the client on sign-up so the insert always satisfies the constraints.
 *
 * @remarks
 * This module is the single source of truth for the `auth` instance.
 * Any route handler or server component that needs authentication should
 * import `auth` from here rather than creating a new client.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        input: true,
      },
      lastName: {
        type: "string",
        required: true,
        input: true,
      },
      cpf: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
});
