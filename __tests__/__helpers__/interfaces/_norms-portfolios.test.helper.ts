import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { INormsPortfolios } from "@/business/interfaces/portfolio/norms-portfolios.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

export const NORM_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const OTHER_NORM_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const PORTFOLIO_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const OTHER_PORTFOLIO_ID = "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64";

export const RELATION = NormsPortfolios.create({
  normId: EntityId.create(NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("20"),
  targetAllocation: SignedPercentage.create("12"),
});

export function createInMemoryNormsPortfoliosRepository(): INormsPortfolios {
  const ROWS = new Map<string, NormsPortfolios>();

  function KEY(normId: string, portfolioId: string): string {
    return `${normId}|${portfolioId}`;
  }

  return {
    async findByNormIdAndPortfolioId(
      normId: string,
      portfolioId: string,
    ): Promise<NormsPortfolios | null> {
      return ROWS.get(KEY(normId, portfolioId)) ?? null;
    },

    async findAllByPortfolioId(
      portfolioId: string,
    ): Promise<NormsPortfolios[]> {
      const MATCHES: NormsPortfolios[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findAllByNormId(normId: string): Promise<NormsPortfolios[]> {
      const MATCHES: NormsPortfolios[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.normId === normId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async save(normsPortfolios: NormsPortfolios): Promise<NormsPortfolios> {
      ROWS.set(
        KEY(normsPortfolios.normId, normsPortfolios.portfolioId),
        normsPortfolios,
      );

      return normsPortfolios;
    },

    async delete(normId: string, portfolioId: string): Promise<void> {
      ROWS.delete(KEY(normId, portfolioId));
    },
  };
}
