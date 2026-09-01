import { db } from "@/__tests__/__setup__/_database.setup";
import { NormsPortfolios } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { NormsPortfoliosRepository } from "@/infrastructure/repositories";
import { NORM_ID, OTHER_NORM_ID, seedNorms } from "./_norm.seed";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  seedPortfolioContext,
} from "./_portfolio.seed";

export const NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("20"),
  targetAllocation: SignedPercentage.create("12"),
});

export const OTHER_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(OTHER_NORM_ID),
  portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("10"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("18"),
});

export const ADDITIONAL_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(OTHER_NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("15"),
  targetAllocation: SignedPercentage.create("10"),
});

export const UPDATED_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(NORM_ID),
  portfolioId: EntityId.create(PORTFOLIO_ID),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("25"),
  targetAllocation: SignedPercentage.create("14"),
});

export async function seedNormRelations(): Promise<NormsPortfolios[]> {
  await seedNorms();
  await seedPortfolioContext();

  const REPOSITORY = new NormsPortfoliosRepository(db);

  return [
    await REPOSITORY.save(NORM_PORTFOLIOS),
    await REPOSITORY.save(OTHER_NORM_PORTFOLIOS),
  ];
}

export async function seedAllNormRelations(): Promise<NormsPortfolios[]> {
  await seedNorms();
  await seedPortfolioContext();

  const REPOSITORY = new NormsPortfoliosRepository(db);

  return [
    await REPOSITORY.save(NORM_PORTFOLIOS),
    await REPOSITORY.save(OTHER_NORM_PORTFOLIOS),
    await REPOSITORY.save(ADDITIONAL_NORM_PORTFOLIOS),
  ];
}
