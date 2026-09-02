import {
  FRESH_STATEMENT,
  OTHER_PORTFOLIO_ID,
  OTHER_STATEMENT,
  OTHER_STATEMENT_ID,
  OTHER_USER_ID,
  PORTFOLIO_ID,
  STATEMENT,
  STATEMENT_ID,
  THIRD_STATEMENT,
  THIRD_STATEMENT_ID,
  UPDATED_STATEMENT,
  USER_ID,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IStatement } from "@/business/interfaces/report/statement.interface";

export {
  STATEMENT_ID,
  OTHER_STATEMENT_ID,
  THIRD_STATEMENT_ID,
  PORTFOLIO_ID,
  OTHER_PORTFOLIO_ID,
  USER_ID,
  OTHER_USER_ID,
  STATEMENT,
  OTHER_STATEMENT,
  THIRD_STATEMENT,
  UPDATED_STATEMENT,
  FRESH_STATEMENT,
};

export const PERIOD_START = STATEMENT.periodStart;
export const PERIOD_END = STATEMENT.periodEnd;

export function createInMemoryStatementRepository(): IStatement {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IStatement["save"]>>
  >({ extractId: (s) => s.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPortfolioId(portfolioId) {
      return BASE.match((s) => s.portfolioId === portfolioId);
    },
    async findAllByGeneratedByUserId(userId) {
      return BASE.match((s) => s.generatedByUserId === userId);
    },
    save: (statement) => BASE.save(statement),
    delete: (id) => BASE.delete(id),
  };
}
