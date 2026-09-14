import { defineRelations } from "drizzle-orm";
import { account, session, user, verification } from "@db-schemas";

// Defines the relations applicable to the `session` table.
// Links a session to its user.
export const sessionRelations = defineRelations(
  { user, account, session, verification },
  (r) => ({
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
  }),
);
