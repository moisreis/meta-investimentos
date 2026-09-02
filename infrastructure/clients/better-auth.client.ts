import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "@/infrastructure/clients/drizzle.client";

/**
 * Configure the *Better Auth* client and export the shared `auth` instance.
 *
 * The client is backed by the *Drizzle* database adapter so all
 * authentication records persist through the Neon/PostgreSQL connection.
 *
 * Authentication is initialized with email-and-password enabled, which
 * provides sign-in, sign-up, and session management out of the box.
 *
 * @remarks
 * This module is the single source of truth for the `auth` instance.
 * Any route handler or server component that needs authentication should
 * import `auth` from here rather than creating a new client.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },
});
