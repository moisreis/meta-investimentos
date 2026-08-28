import { defineRelations } from "drizzle-orm";
import { account, session, user, verification } from "../../schemas";

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
