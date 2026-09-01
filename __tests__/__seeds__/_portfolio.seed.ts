import { db } from "@/__tests__/__setup__/_database.setup";
import { Portfolio } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { portfolio } from "@/infrastructure/database/schemas";
import { PortfolioRepository } from "@/infrastructure/repositories";
import { OTHER_USER_ID, seedUserById, USER_ID } from "./_user.seed";

export const PORTFOLIO_ID = "0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b";
export const OTHER_PORTFOLIO_ID = "1f2a3b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c";
export const THIRD_PORTFOLIO_ID = "123e4567-e89b-4d3c-a456-426614174000";

export const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create(USER_ID),
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  PORTFOLIO_ID,
);

export const OTHER_PORTFOLIO = Portfolio.create(
  {
    acronym: "RF",
    name: "Renda Fixa",
    userId: EntityId.create(OTHER_USER_ID),
    annualInterestRate: SignedPercentage.create("8"),
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  OTHER_PORTFOLIO_ID,
);

export const THIRD_PORTFOLIO = Portfolio.create(
  {
    acronym: "CMB",
    name: "Carteira Multimercado",
    userId: EntityId.create(USER_ID),
    annualInterestRate: SignedPercentage.create("12"),
    minAllocation: SignedPercentage.create("0"),
    maxAllocation: SignedPercentage.create("40"),
    targetAllocation: SignedPercentage.create("20"),
  },
  THIRD_PORTFOLIO_ID,
);

export const FRESH_PORTFOLIO = Portfolio.create({
  acronym: "MM",
  name: "Fundo Multimercado",
  userId: EntityId.create(USER_ID),
  annualInterestRate: SignedPercentage.create("9"),
  minAllocation: SignedPercentage.create("0"),
  maxAllocation: SignedPercentage.create("30"),
  targetAllocation: SignedPercentage.create("15"),
});

export const UPDATED_PORTFOLIO = Portfolio.create(
  {
    acronym: PORTFOLIO.acronym,
    name: PORTFOLIO.name,
    userId: PORTFOLIO.userId,
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("15"),
  },
  PORTFOLIO_ID,
);

export async function seedPortfolioById(id: string): Promise<Portfolio> {
  const REPOSITORY = new PortfolioRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
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
