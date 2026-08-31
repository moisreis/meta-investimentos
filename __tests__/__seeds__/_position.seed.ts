import { db } from "@/__tests__/__setup__/_database.setup";
import { Position } from "@/business/entities";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import { position } from "@/infrastructure/database/schemas";
import { PositionRepository } from "@/infrastructure/repositories";
import { FUND_ID, OTHER_FUND_ID, seedFundById } from "./_fund.seed";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  seedPortfolioById,
} from "./_portfolio.seed";

export const POSITION_ID = "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d";
export const OTHER_POSITION_ID = "3b4c5d6e-7f8a-4b9c-8d0e-1f2a3b4c5d6e";
export const THIRD_POSITION_ID = "10a1b2c3-4d5e-4f6a-8b7c-9d0e1f2a3b4c";

export const POSITION = Position.create(
  { portfolioId: PORTFOLIO_ID, fundId: FUND_ID },
  POSITION_ID,
);

export const OTHER_POSITION = Position.create(
  { portfolioId: OTHER_PORTFOLIO_ID, fundId: OTHER_FUND_ID },
  OTHER_POSITION_ID,
);

export const THIRD_POSITION = Position.create(
  { portfolioId: PORTFOLIO_ID, fundId: OTHER_FUND_ID },
  THIRD_POSITION_ID,
);

export const FRESH_POSITION = Position.create({
  portfolioId: PORTFOLIO_ID,
  fundId: FUND_ID,
});

export const UPDATED_POSITION = Position.create(
  {
    portfolioId: POSITION.portfolioId,
    fundId: POSITION.fundId,
    initialBalance: PositiveMoney.create("5000.00"),
    initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
  },
  POSITION_ID,
);

export async function seedPositionById(id: string): Promise<Position> {
  const REPOSITORY = new PositionRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
  if (EXISTING) return EXISTING;

  const FIXTURE =
    id === POSITION_ID
      ? POSITION
      : id === OTHER_POSITION_ID
        ? OTHER_POSITION
        : THIRD_POSITION;

  await seedPortfolioById(FIXTURE.portfolioId);
  await seedFundById(FIXTURE.fundId);

  await db.insert(position).values({
    id: FIXTURE.id,
    portfolioId: FIXTURE.portfolioId,
    fundId: FIXTURE.fundId,
    initialBalance: FIXTURE.initialBalance?.value.toString() ?? null,
    initialBalanceDate: FIXTURE.initialBalanceDate ?? null,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

export async function seedPositions(): Promise<Position[]> {
  return [
    await seedPositionById(POSITION_ID),
    await seedPositionById(OTHER_POSITION_ID),
    await seedPositionById(THIRD_POSITION_ID),
  ];
}

export async function seedPositionContext(): Promise<void> {
  await seedPositionById(POSITION_ID);
  await seedPositionById(OTHER_POSITION_ID);
}

export async function seedPositionFixtureParents(): Promise<void> {
  await seedPortfolioById(PORTFOLIO_ID);
  await seedFundById(FUND_ID);
  await seedFundById(OTHER_FUND_ID);
}
