import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IPortfolio } from "@/business/interfaces/portfolio/portfolio.interface";

export {
  FRESH_PORTFOLIO,
  OTHER_PORTFOLIO,
  OTHER_PORTFOLIO_ID,
  OTHER_USER_ID,
  PORTFOLIO,
  PORTFOLIO_ID,
  THIRD_PORTFOLIO,
  THIRD_PORTFOLIO_ID,
  UPDATED_PORTFOLIO,
  USER_ID,
} from "@/__tests__/__fixtures__";

export function createInMemoryPortfolioRepository(): IPortfolio {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IPortfolio["save"]>>
  >({ extractId: (p) => p.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByUserId(userId) {
      return BASE.match((p) => p.userId === userId);
    },
    save: (portfolio) => BASE.save(portfolio),
    delete: (id) => BASE.delete(id),
  };
}
