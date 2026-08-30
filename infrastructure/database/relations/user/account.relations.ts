import { defineRelations } from "drizzle-orm";
import { account, session, user, verification } from "../../schemas";

/**
 * Defines the relations applicable to the `account` table.
 *
 * An account always belongs to exactly one {@link user}, linked
 * through the `userId` foreign key.
 */
export const accountRelations = defineRelations(
  { user, account, session, verification },
  (r) => ({
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
  }),
);
