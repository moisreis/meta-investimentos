import { defineRelations } from "drizzle-orm";
import { portfolio, statement, user } from "@db-schemas";

// Defines the relations applicable to the `statement` table.
// Links a statement to its portfolio and generating user.
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
