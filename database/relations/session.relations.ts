import { defineRelations } from "drizzle-orm"
import { account, session, user, verification } from "@db-schemas"

// Connects a session to its owning user.
export const sessionRelations = defineRelations(
  { user, account, session, verification },
  (r) => ({
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
  })
)
