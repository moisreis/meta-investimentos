import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "@db-schemas";
import { db } from "./database.client";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification },
    }),
    emailAndPassword: {
      enabled: true,
    },
});
