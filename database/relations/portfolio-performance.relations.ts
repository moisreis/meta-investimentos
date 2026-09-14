import { defineRelations } from "drizzle-orm";
import { portfolio, portfolioPerformance } from "@db-schemas";

// Defines the relations for the `portfolio_performance` table.
// Links a performance record to its portfolio.
export const portfolioPerformanceRelations = defineRelations(
  { portfolio, portfolioPerformance },
  (r) => ({
    portfolioPerformance: {
      portfolio: r.one.portfolio({
        from: r.portfolioPerformance.portfolioId,
        to: r.portfolio.id,
      }),
    },
  }),
);
