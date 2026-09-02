import {
  FRESH_POSITION,
  FUND_ID,
  OTHER_FUND_ID,
  OTHER_POSITION,
  OTHER_POSITION_ID,
  PORTFOLIO_ID,
  POSITION,
  POSITION_ID,
  THIRD_POSITION,
  THIRD_POSITION_ID,
  UPDATED_POSITION,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Position } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { position } from "@/infrastructure/database/schemas";
import { PositionRepository } from "@/infrastructure/repositories";
import { seedFundById } from "./_fund.seed";
import { seedPortfolioById } from "./_portfolio.seed";

export {
  POSITION_ID,
  OTHER_POSITION_ID,
  THIRD_POSITION_ID,
  POSITION,
  OTHER_POSITION,
  THIRD_POSITION,
  FRESH_POSITION,
  UPDATED_POSITION,
};

export async function seedPositionById(id: string): Promise<Position> {
  const REPOSITORY = new PositionRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
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
