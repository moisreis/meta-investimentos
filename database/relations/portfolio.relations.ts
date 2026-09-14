import { defineRelations } from "drizzle-orm";
import {
  bankAccount,
  normsPortfolios,
  portfolio,
  portfolioPerformance,
  position,
  statement,
  user,
} from "@db-schemas";

// Defines the relations applicable to the `portfolio` table.
// Links a portfolio to its user, accounts, positions, and norms.
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
