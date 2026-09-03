import { ID } from "@/__tests__/__fixtures__";
import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { INormsPortfolios } from "@/business/interfaces/portfolio/norms-portfolios.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

const NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.DEFAULT),
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("20"),
  targetAllocation: SignedPercentage.create("12"),
});

const OTHER_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.OTHER),
  portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
  minAllocation: SignedPercentage.create("10"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("18"),
});

const ADDITIONAL_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.OTHER),
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("15"),
  targetAllocation: SignedPercentage.create("10"),
});

const UPDATED_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.DEFAULT),
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("14"),
});

export {
  NORM_PORTFOLIOS,
  OTHER_NORM_PORTFOLIOS,
  ADDITIONAL_NORM_PORTFOLIOS,
  UPDATED_NORM_PORTFOLIOS,
};

/**
 * Represents the default norm identifier referenced by
 * {@link NORM_PORTFOLIOS}.
 */
export const NORM_ID = ID.NORM.DEFAULT;

/**
 * Represents the other norm identifier referenced by
 * {@link OTHER_NORM_PORTFOLIOS}.
 */
export const OTHER_NORM_ID = ID.NORM.OTHER;

/**
 * Represents the default portfolio identifier referenced by
 * {@link NORM_PORTFOLIOS}.
 */
export const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

/**
 * Represents the other portfolio identifier referenced by
 * {@link OTHER_NORM_PORTFOLIOS}.
 */
export const OTHER_PORTFOLIO_ID = ID.PORTFOLIO.OTHER;

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
