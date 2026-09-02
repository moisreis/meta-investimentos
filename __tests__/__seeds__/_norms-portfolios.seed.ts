import {
  ADDITIONAL_NORM_PORTFOLIOS,
  NORM_PORTFOLIOS,
  OTHER_NORM_PORTFOLIOS,
  UPDATED_NORM_PORTFOLIOS,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { NormsPortfolios } from "@/business/entities";
import { NormsPortfoliosRepository } from "@/infrastructure/repositories";
import { seedNorms } from "./_norm.seed";
import { seedPortfolioContext } from "./_portfolio.seed";

export {
  NORM_PORTFOLIOS,
  OTHER_NORM_PORTFOLIOS,
  ADDITIONAL_NORM_PORTFOLIOS,
  UPDATED_NORM_PORTFOLIOS,
};

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
