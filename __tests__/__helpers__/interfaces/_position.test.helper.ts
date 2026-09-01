import { Position } from "@/business/entities/portfolio/position.entity";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

export const POSITION_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const PORTFOLIO_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const OTHER_PORTFOLIO_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";
export const FUND_ID = "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52";
export const OTHER_FUND_ID = "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64";

export const POSITION = Position.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    fundId: EntityId.create(FUND_ID),
  },
  POSITION_ID,
);

export function createInMemoryPositionRepository(): IPosition {
  const ROWS = new Map<string, Position>();

  return {
    async findById(id: string): Promise<Position | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByPortfolioId(portfolioId: string): Promise<Position[]> {
      const MATCHES: Position[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async findByPortfolioIdAndFundId(
      portfolioId: string,
      fundId: string,
    ): Promise<Position | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId && ROW.fundId === fundId) {
          return ROW;
        }
      }

      return null;
    },

    async save(position: Position): Promise<Position> {
      ROWS.set(position.id ?? "generated-id", position);

      return position;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
