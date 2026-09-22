import { defineRelations } from "drizzle-orm"
import { portfolio, statement, user } from "@db-schemas"

// Connects a statement to its portfolio.
// Also links the user who generated the statement.
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
  })
)
