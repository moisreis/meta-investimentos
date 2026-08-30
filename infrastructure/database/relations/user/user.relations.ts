import { defineRelations } from "drizzle-orm";
import {
  account,
  auditLog,
  portfolio,
  session,
  statement,
  user,
  verification,
} from "../../schemas";

/**
 * Defines the relations applicable to the `user` table.
 *
 * A user can own multiple {@link account}, {@link session}, and
 * {@link portfolio} rows, as well as generated {@link statement} and
 * {@link auditLog} rows, each linked through their foreign keys.
 */
export const userRelations = defineRelations(
  { user, account, session, verification, portfolio, statement, auditLog },
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
      portfolios: r.many.portfolio({
        from: r.user.id,
        to: r.portfolio.userId,
      }),
      statements: r.many.statement({
        from: r.user.id,
        to: r.statement.generatedByUserId,
      }),
      auditLogs: r.many.auditLog({
        from: r.user.id,
        to: r.auditLog.userId,
      }),
    },
  }),
);
