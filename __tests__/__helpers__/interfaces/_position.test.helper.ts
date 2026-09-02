import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";

export {
  FRESH_POSITION,
  FUND_ID,
  OTHER_FUND_ID,
  OTHER_PORTFOLIO_ID,
  OTHER_POSITION,
  OTHER_POSITION_ID,
  PORTFOLIO_ID,
  POSITION,
  POSITION_ID,
  THIRD_POSITION,
  THIRD_POSITION_ID,
  UPDATED_POSITION,
} from "@/__tests__/__fixtures__";

export function createInMemoryPositionRepository(): IPosition {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IPosition["save"]>>>(
    { extractId: (p) => p.id },
  );

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPortfolioId(portfolioId) {
      return BASE.match((p) => p.portfolioId === portfolioId);
    },
    async findAllByPortfolioIds(portfolioIds) {
      return BASE.match((p) => portfolioIds.includes(p.portfolioId));
    },
    async findByPortfolioIdAndFundId(portfolioId, fundId) {
      return BASE.findOne(
        (p) => p.portfolioId === portfolioId && p.fundId === fundId,
      );
    },
    save: (position) => BASE.save(position),
    delete: (id) => BASE.delete(id),
  };
}
