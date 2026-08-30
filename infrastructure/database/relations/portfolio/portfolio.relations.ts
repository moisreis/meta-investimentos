import { defineRelations } from "drizzle-orm";
import {
  bankAccount,
  normsPortfolios,
  portfolio,
  portfolioPerformance,
  position,
  statement,
  user,
} from "../../schemas";

/**
 * Defines the relations applicable to the `portfolio` table.
 *
 * A portfolio always belongs to exactly one {@link user} and can own
 * multiple {@link bankAccount}, {@link position},
 * {@link portfolioPerformance}, {@link statement}, and
 * {@link normsPortfolios} rows, each linked through their foreign
 * keys.
 */
export const portfolioRelations = defineRelations(
  {
    user,
    portfolio,
    bankAccount,
    position,
    portfolioPerformance,
    statement,
    normsPortfolios,
  },
  (r) => ({
    portfolio: {
      user: r.one.user({
        from: r.portfolio.userId,
        to: r.user.id,
      }),
      bankAccounts: r.many.bankAccount({
        from: r.portfolio.id,
        to: r.bankAccount.portfolioId,
      }),
      positions: r.many.position({
        from: r.portfolio.id,
        to: r.position.portfolioId,
      }),
      portfolioPerformances: r.many.portfolioPerformance({
        from: r.portfolio.id,
        to: r.portfolioPerformance.portfolioId,
      }),
      statements: r.many.statement({
        from: r.portfolio.id,
        to: r.statement.portfolioId,
      }),
      norms: r.many.normsPortfolios({
        from: r.portfolio.id,
        to: r.normsPortfolios.portfolioId,
      }),
    },
  }),
);
