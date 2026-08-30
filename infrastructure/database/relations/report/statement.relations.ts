import { defineRelations } from "drizzle-orm";
import { portfolio, statement, user } from "../../schemas";

/**
 * Defines the relations applicable to the `statement` table.
 *
 * A statement can optionally belong to exactly one {@link portfolio}
 * and can be attributed to one {@link user}, linked through the
 * `portfolioId` and `generatedByUserId` foreign keys.
 */
export const statementRelations = defineRelations(
  { user, portfolio, statement },
  (r) => ({
    statement: {
      portfolio: r.one.portfolio({
        from: r.statement.portfolioId,
        to: r.portfolio.id,
      }),
      generatedBy: r.one.user({
        from: r.statement.generatedByUserId,
        to: r.user.id,
      }),
    },
  }),
);
