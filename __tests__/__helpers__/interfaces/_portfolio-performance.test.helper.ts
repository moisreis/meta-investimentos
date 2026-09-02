import {
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
  FEBRUARY_PERFORMANCE_DATE,
  FRESH_PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_ID,
  OTHER_PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_PERFORMANCE_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
  PORTFOLIO_ID,
  PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE_ID,
  UPDATED_PORTFOLIO_PERFORMANCE,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IPortfolioPerformance } from "@/business/interfaces/performance/portfolio-performance.interface";

export {
  PORTFOLIO_PERFORMANCE_ID,
  OTHER_PORTFOLIO_PERFORMANCE_ID,
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
  PORTFOLIO_ID,
  OTHER_PORTFOLIO_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  FEBRUARY_PERFORMANCE_DATE,
  PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_PERFORMANCE,
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
  UPDATED_PORTFOLIO_PERFORMANCE,
  FRESH_PORTFOLIO_PERFORMANCE,
};

export const PERFORMANCE_ID = PORTFOLIO_PERFORMANCE_ID;
export const PERFORMANCE = PORTFOLIO_PERFORMANCE;

export function createInMemoryPortfolioPerformanceRepository(): IPortfolioPerformance {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IPortfolioPerformance["save"]>>
  >({ extractId: (pp) => pp.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPortfolioId(portfolioId) {
      return BASE.match((pp) => pp.portfolioId === portfolioId);
    },
    async findByPortfolioIdAndDate(portfolioId, date) {
      return BASE.findOne(
        (pp) =>
          pp.portfolioId === portfolioId &&
          pp.date.getTime() === date.getTime(),
      );
    },
    async findLatestByPortfolioId(portfolioId) {
      const FOUND = BASE.match((pp) => pp.portfolioId === portfolioId);

      if (FOUND.length === 0) return null;

      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (portfolioPerformance) => BASE.save(portfolioPerformance),
    delete: (id) => BASE.delete(id),
  };
}
