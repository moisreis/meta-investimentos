import {
  ADDITIONAL_NORM_PORTFOLIOS,
  NORM_ID,
  NORM_PORTFOLIOS,
  OTHER_NORM_ID,
  OTHER_NORM_PORTFOLIOS,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  UPDATED_NORM_PORTFOLIOS,
} from "@/__tests__/__fixtures__";
import type { INormsPortfolios } from "@/business/interfaces/portfolio/norms-portfolios.interface";

export {
  NORM_ID,
  OTHER_NORM_ID,
  PORTFOLIO_ID,
  OTHER_PORTFOLIO_ID,
  NORM_PORTFOLIOS,
  OTHER_NORM_PORTFOLIOS,
  ADDITIONAL_NORM_PORTFOLIOS,
  UPDATED_NORM_PORTFOLIOS,
};

export const RELATION = NORM_PORTFOLIOS;

export function createInMemoryNormsPortfoliosRepository(): INormsPortfolios {
  const ROWS = new Map<
    string,
    import("@/business/entities/portfolio/norms-portfolios.entity").NormsPortfolios
  >();

  function KEY(normId: string, portfolioId: string): string {
    return `${normId}|${portfolioId}`;
  }

  return {
    async findByNormIdAndPortfolioId(normId, portfolioId) {
      return ROWS.get(KEY(normId, portfolioId)) ?? null;
    },

    async findAllByPortfolioId(portfolioId) {
      const MATCHES: import("@/business/entities/portfolio/norms-portfolios.entity").NormsPortfolios[] =
        [];

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findAllByNormId(normId) {
      const MATCHES: import("@/business/entities/portfolio/norms-portfolios.entity").NormsPortfolios[] =
        [];

      for (const ROW of ROWS.values()) {
        if (ROW.normId === normId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async save(normsPortfolios) {
      ROWS.set(
        KEY(normsPortfolios.normId, normsPortfolios.portfolioId),
        normsPortfolios,
      );

      return normsPortfolios;
    },

    async delete(normId, portfolioId) {
      ROWS.delete(KEY(normId, portfolioId));
    },
  };
}
