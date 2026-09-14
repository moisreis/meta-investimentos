import { defineRelations } from "drizzle-orm";
import {
  account,
  auditLog,
  portfolio,
  session,
  statement,
  user,
  verification,
} from "@db-schemas";

// Defines the relations applicable to the `user` table.
// Links users to their accounts, sessions, and portfolios.
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
