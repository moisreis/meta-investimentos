import { defineRelations } from "drizzle-orm";
import { account, session, user, verification } from "../../schemas";

export const userRelations = defineRelations(
  { user, account, session, verification },
  (r) => ({
    user: {
      accounts: r.many.account({
        from: r.user.id,
        to: r.account.userId,
      }),
      sessions: r.many.session({
        from: r.user.id,
        to: r.session.userId,
      }),
    },
  }),
);
