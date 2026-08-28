import { defineRelations } from "drizzle-orm";
import { account, session, user, verification } from "../../schemas";

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
