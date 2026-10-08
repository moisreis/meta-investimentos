import "dotenv/config"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  account,
  session,
  user,
  verification,
} from "@db-schemas"
import { db } from "@/clients/database.client"

/**
 * @summary
 * Builds the **Better-Auth** instance configured for the application.
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
 * email/password sign-in.
 *
 * @returns The configured **Better-Auth** instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function createAuth() {
  return betterAuth({
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
}

let _auth: ReturnType<typeof createAuth> | null = null

/**
 * @summary
 * **Better-Auth** instance configured for the application.
 *
 * @remarks
 * Lazy instance. The real object is built on the first
 * property access, so importing this module never touches
 * the database. That keeps module evaluation safe during
 * the production build, when `DATABASE_URL` is not present.
 * At request time the environment variable is set and the
 * instance connects on demand.
 *
 * @explanation
 * The adapter needs the database client at construction time.
 * Constructing it eagerly at import time made the build fail
 * where the database host is unreachable or the variable is
 * unset, so the instance is deferred until a handler uses it.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-07
 */
export const auth = new Proxy(
  {} as ReturnType<typeof createAuth>,
  {
    get(_target, prop) {
      if (!_auth) {
        _auth = createAuth()
      }

      const VALUE = Reflect.get(_auth, prop)

      return typeof VALUE === "function"
        ? VALUE.bind(_auth)
        : VALUE
    },
  }
)
