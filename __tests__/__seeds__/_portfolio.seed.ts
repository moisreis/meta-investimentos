import {
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
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Portfolio } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { portfolio } from "@/infrastructure/database/schemas";
import { PortfolioRepository } from "@/infrastructure/repositories";
import { seedUserById } from "./_user.seed";

export {
  PORTFOLIO_ID,
  OTHER_PORTFOLIO_ID,
  THIRD_PORTFOLIO_ID,
  PORTFOLIO,
  OTHER_PORTFOLIO,
  THIRD_PORTFOLIO,
  FRESH_PORTFOLIO,
  UPDATED_PORTFOLIO,
};

export async function seedPortfolioById(id: string): Promise<Portfolio> {
  const REPOSITORY = new PortfolioRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE =
    id === PORTFOLIO_ID
      ? PORTFOLIO
      : id === OTHER_PORTFOLIO_ID
        ? OTHER_PORTFOLIO
        : THIRD_PORTFOLIO;

  await seedUserById(FIXTURE.userId);

  await db.insert(portfolio).values({
    id: FIXTURE.id,
    acronym: FIXTURE.acronym,
    name: FIXTURE.name,
    userId: FIXTURE.userId,
    annualInterestRate: FIXTURE.annualInterestRate.value.toString(),
    minAllocation: FIXTURE.minAllocation.value.toString(),
    maxAllocation: FIXTURE.maxAllocation.value.toString(),
    targetAllocation: FIXTURE.targetAllocation.value.toString(),
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

export async function seedPortfolios(): Promise<Portfolio[]> {
  return [
    await seedPortfolioById(PORTFOLIO_ID),
    await seedPortfolioById(OTHER_PORTFOLIO_ID),
    await seedPortfolioById(THIRD_PORTFOLIO_ID),
  ];
}

export async function seedPortfolioContext(): Promise<void> {
  await seedPortfolioById(PORTFOLIO_ID);
  await seedPortfolioById(OTHER_PORTFOLIO_ID);
}

export async function seedPortfolioFixtureParents(): Promise<void> {
  await seedUserById(USER_ID);
  await seedUserById(OTHER_USER_ID);
}
