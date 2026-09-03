import { ID } from "@/__tests__/__fixtures__/_ids";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Position } from "@/business/entities";
import { Position as PositionEntity } from "@/business/entities/portfolio/position.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { position } from "@/infrastructure/database/schemas";
import { PositionRepository } from "@/infrastructure/repositories";
import { seedFundById } from "./_fund.seed";
import { seedPortfolioById } from "./_portfolio.seed";

/**
 * Represents the default position
 * identifier.
 */
export const POSITION_ID = ID.POSITION.DEFAULT;

/**
 * Represents the alternate position
 * identifier.
 */
export const OTHER_POSITION_ID = ID.POSITION.OTHER;

/**
 * Represents the third position
 * identifier.
 */
export const THIRD_POSITION_ID = ID.POSITION.THIRD;

/**
 * Represents the default position fixture
 * linked to the default portfolio and fund.
 */
export const POSITION = PositionEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    fundId: EntityId.create(ID.FUND.DEFAULT),
  },
  ID.POSITION.DEFAULT,
);

/**
 * Represents an alternate position fixture
 * linked to the alternate portfolio and fund.
 */
export const OTHER_POSITION = PositionEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
    fundId: EntityId.create(ID.FUND.OTHER),
  },
  ID.POSITION.OTHER,
);

/**
 * Represents a third position fixture
 * linked to the default portfolio and
 * the alternate fund.
 */
export const THIRD_POSITION = PositionEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    fundId: EntityId.create(ID.FUND.OTHER),
  },
  ID.POSITION.THIRD,
);

/**
 * Represents a position fixture with a
 * generated ID for insert tests.
 */
export const FRESH_POSITION = PositionEntity.create({
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  fundId: EntityId.create(ID.FUND.DEFAULT),
});

/**
 * Represents a position fixture with an
 * initial balance and balance date set.
 */
export const UPDATED_POSITION = PositionEntity.create(
  {
    portfolioId: POSITION.portfolioId,
    fundId: POSITION.fundId,
    initialBalance: PositiveMoney.create("5000.00"),
    initialBalanceDate: new Date("2026-01-10T00:00:00.000Z"),
  },
  ID.POSITION.DEFAULT,
);

/**
 * Seeds a single {@link Position} row by
 * its identifier.
 *
 * Returns the existing row when the
 * identifier already exists in the
 * database. Seeds the parent portfolio
 * and fund before inserting the position.
 *
 * @param id - The position identifier.
 * @returns The seeded {@link Position}.
 */
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

/**
 * Seeds all three default position rows
 * into the database.
 *
 * @returns The seeded {@link Position}
 *          array with all three entries.
 */
export async function seedPositions(): Promise<Position[]> {
  return [
    await seedPositionById(POSITION_ID),
    await seedPositionById(OTHER_POSITION_ID),
    await seedPositionById(THIRD_POSITION_ID),
  ];
}

/**
 * Seeds the default and alternate
 * position rows for context-dependent
 * test scenarios.
 */
export async function seedPositionContext(): Promise<void> {
  await seedPositionById(POSITION_ID);
  await seedPositionById(OTHER_POSITION_ID);
}

/**
 * Seeds only the parent portfolio and fund
 * entities that the position fixtures
 * depend on.
 */
export async function seedPositionFixtureParents(): Promise<void> {
  await seedPortfolioById(ID.PORTFOLIO.DEFAULT);
  await seedFundById(ID.FUND.DEFAULT);
  await seedFundById(ID.FUND.OTHER);
}
