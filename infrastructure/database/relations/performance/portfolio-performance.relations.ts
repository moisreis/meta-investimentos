import { defineRelations } from "drizzle-orm";
import { portfolio, portfolioPerformance } from "../../schemas";

/**
 * Defines the relations applicable to the `portfolio_performance`
 * table.
 *
 * A performance record always belongs to exactly one {@link
 * portfolio}, linked through the `portfolioId` foreign key.
 */
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
