import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { portfolio } from "@/infrastructure/database/schemas";
import { PortfolioRepository } from "@/infrastructure/repositories";
import { seedUserById } from "./_user.seed";

/**
 * Represents the default portfolio fixture
 * with an equity fund allocation profile.
 */
const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create(ID.USER.DEFAULT),
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  ID.PORTFOLIO.DEFAULT,
);

/**
 * Represents an alternate portfolio fixture
 * with a fixed-income allocation profile.
 */
const OTHER_PORTFOLIO = Portfolio.create(
  {
    acronym: "RF",
    name: "Renda Fixa",
    userId: EntityId.create(ID.USER.OTHER),
    annualInterestRate: SignedPercentage.create("8"),
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  ID.PORTFOLIO.OTHER,
);

/**
 * Represents a third portfolio fixture
 * with a multi-asset allocation profile.
 */
const THIRD_PORTFOLIO = Portfolio.create(
  {
    acronym: "CMB",
    name: "Carteira Multimercado",
    userId: EntityId.create(ID.USER.DEFAULT),
    annualInterestRate: SignedPercentage.create("12"),
    minAllocation: SignedPercentage.create("0"),
    maxAllocation: SignedPercentage.create("40"),
    targetAllocation: SignedPercentage.create("20"),
  },
  ID.PORTFOLIO.THIRD,
);

/**
 * Represents a portfolio fixture with a
 * generated ID for insert tests.
 */
const FRESH_PORTFOLIO = Portfolio.create({
  acronym: "MM",
  name: "Fundo Multimercado",
  userId: EntityId.create(ID.USER.DEFAULT),
  annualInterestRate: SignedPercentage.create("9"),
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("15"),
});

/**
 * Represents a portfolio fixture with an
 * updated target allocation percentage.
 */
const UPDATED_PORTFOLIO = Portfolio.create(
  {
    acronym: PORTFOLIO.acronym,
    name: PORTFOLIO.name,
    userId: PORTFOLIO.userId,
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("15"),
  },
  ID.PORTFOLIO.DEFAULT,
);

export {
  PORTFOLIO,
  OTHER_PORTFOLIO,
  THIRD_PORTFOLIO,
  FRESH_PORTFOLIO,
  UPDATED_PORTFOLIO,
};

/**
 * Represents the default portfolio identifier for tests.
 */
export const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

/**
 * Represents the other portfolio identifier for tests.
 */
export const OTHER_PORTFOLIO_ID = ID.PORTFOLIO.OTHER;

/**
 * Represents the third portfolio identifier for tests.
 */
export const THIRD_PORTFOLIO_ID = ID.PORTFOLIO.THIRD;

/**
 * Seeds a single {@link Portfolio} row by
 * its identifier.
 *
 * Returns the existing row when the
 * identifier already exists in the
 * database. Seeds the parent user
 * before inserting the portfolio.
 *
 * @param id - The portfolio identifier.
 * @returns The seeded {@link Portfolio}.
 */
export async function seedPortfolioById(id: string): Promise<Portfolio> {
  const REPOSITORY = new PortfolioRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE =
    id === ID.PORTFOLIO.DEFAULT
      ? PORTFOLIO
      : id === ID.PORTFOLIO.OTHER
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

/**
 * Seeds all three default portfolio rows
 * into the database.
 *
 * @returns The seeded {@link Portfolio}
 *          array with all three entries.
 */
export async function seedPortfolios(): Promise<Portfolio[]> {
  return [
    await seedPortfolioById(ID.PORTFOLIO.DEFAULT),
    await seedPortfolioById(ID.PORTFOLIO.OTHER),
    await seedPortfolioById(ID.PORTFOLIO.THIRD),
  ];
}

/**
 * Seeds the default and alternate
 * portfolio rows for context-dependent
 * test scenarios.
 */
export async function seedPortfolioContext(): Promise<void> {
  await seedPortfolioById(ID.PORTFOLIO.DEFAULT);
  await seedPortfolioById(ID.PORTFOLIO.OTHER);
}

/**
 * Seeds only the parent user entities
 * that the portfolio fixtures depend on.
 */
export async function seedPortfolioFixtureParents(): Promise<void> {
  await seedUserById(ID.USER.DEFAULT);
  await seedUserById(ID.USER.OTHER);
}
