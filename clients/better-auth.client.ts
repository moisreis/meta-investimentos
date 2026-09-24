import "dotenv/config"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { account, session, user, verification } from "@db-schemas"
import { db } from "@/clients/database.client"

/**
 * @summary
 * **Better-Auth** instance configured for the application.
 *
 * @remarks
 * Uses the Drizzle adapter with PostgreSQL and the shared
 * database client. Enables email/password authentication and
 * extends the user model with custom fields.
 *
 * @explanation
 * Central authentication service instance. It connects to the
 * database via Drizzle ORM, defines the user schema with
 * required firstName, lastName, and CPF fields, and enables
 * email/password sign-in. Used by both server and client
 * authentication flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      cpf: { type: "string", required: true },
      role: { type: "string", required: false },
    },
  },
})