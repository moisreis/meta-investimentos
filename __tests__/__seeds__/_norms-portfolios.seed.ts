import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { NormsPortfoliosRepository } from "@/infrastructure/repositories";
import { seedNorms } from "./_norm.seed";
import { seedPortfolioContext } from "./_portfolio.seed";

/**
 * Represents the default norm-portfolio
 * association fixture.
 */
const NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.DEFAULT),
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("20"),
  targetAllocation: SignedPercentage.create("12"),
});

/**
 * Represents an alternate norm-portfolio
 * association fixture.
 */
const OTHER_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.OTHER),
  portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
  minAllocation: SignedPercentage.create("10"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("18"),
});

/**
 * Represents an additional norm-portfolio
 * association fixture for multi-relation
 * test scenarios.
 */
const ADDITIONAL_NORM_PORTFOLIOS = NormsPortfolios.create({
  normId: EntityId.create(ID.NORM.OTHER),
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  minAllocation: SignedPercentage.create("5"),
  maxAllocation: SignedPercentage.create("15"),
  targetAllocation: SignedPercentage.create("10"),
});

/**
 * Represents a norm-portfolio association
 * fixture with an updated allocation range.
 */
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
 * Seeds the default and alternate
 * norm-portfolio associations.
 *
 * Seeds the parent norms and portfolio
 * context before saving the relations.
 *
 * @returns The seeded
 *          {@link NormsPortfolios} array.
 */
export async function seedNormRelations(): Promise<NormsPortfolios[]> {
  await seedNorms();
  await seedPortfolioContext();

  const REPOSITORY = new NormsPortfoliosRepository(db);

  return [
    await REPOSITORY.save(NORM_PORTFOLIOS),
    await REPOSITORY.save(OTHER_NORM_PORTFOLIOS),
  ];
}

/**
 * Seeds all norm-portfolio associations,
 * including the additional relation.
 *
 * Seeds the parent norms and portfolio
 * context before saving the relations.
 *
 * @returns The full
 *          {@link NormsPortfolios} array.
 */
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
