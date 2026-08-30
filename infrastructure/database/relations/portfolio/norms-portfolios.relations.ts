import { defineRelations } from "drizzle-orm";
import { norm, normsPortfolios, portfolio } from "../../schemas";

/**
 * Defines the relations applicable to the `norms_portfolios` table.
 *
 * A norm/portfolio link always belongs to exactly one {@link norm} and
 * one {@link portfolio}, referenced through its composite primary key
 * columns.
 */
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
