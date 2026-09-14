import { defineRelations } from "drizzle-orm";
import { norm, normsPortfolios, portfolio } from "@db-schemas";

// Defines the relations for the `norms_portfolios` table.
// Links a join row to its norm and portfolio.
export const normsPortfoliosRelations = defineRelations(
  { norm, portfolio, normsPortfolios },
  (r) => ({
    normsPortfolios: {
      norm: r.one.norm({
        from: r.normsPortfolios.normId,
        to: r.norm.id,
      }),
      portfolio: r.one.portfolio({
        from: r.normsPortfolios.portfolioId,
        to: r.portfolio.id,
      }),
    },
  }),
);
