import { defineRelations } from "drizzle-orm";
import { account, session, user, verification } from "../../schemas";

/**
 * Defines the relations applicable to the `session` table.
 *
 * A session always belongs to exactly one {@link user}, linked
 * through the `userId` foreign key.
 */
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
