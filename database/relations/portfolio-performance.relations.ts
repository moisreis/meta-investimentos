import { defineRelations } from "drizzle-orm"
import { portfolio, portfolioPerformance } from "@db-schemas"

// Connects a performance record to its portfolio.
export const portfolioPerformanceRelations = defineRelations(
  { portfolio, portfolioPerformance },
  (r) => ({
    portfolioPerformance: {
      portfolio: r.one.portfolio({
        from: r.portfolioPerformance.portfolioId,
        to: r.portfolio.id,
      }),
    },
  })
)
