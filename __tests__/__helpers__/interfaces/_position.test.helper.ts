import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { ID } from "@/__tests__/__fixtures__/_ids";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";
import { Position as PositionEntity } from "@/business/entities/portfolio/position.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";

/**
 * Represents the default position identifier for tests.
 */
export const POSITION_ID = ID.POSITION.DEFAULT;

/**
 * Represents the secondary position identifier for tests.
 */
export const OTHER_POSITION_ID = ID.POSITION.OTHER;

/**
 * Represents the third position identifier for tests.
 */
export const THIRD_POSITION_ID = ID.POSITION.THIRD;

/**
 * Represents the default portfolio identifier for tests.
 */
export const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

/**
 * Represents the secondary portfolio identifier for tests.
 */
export const OTHER_PORTFOLIO_ID = ID.PORTFOLIO.OTHER;

/**
 * Represents the default fund identifier for tests.
 */
export const FUND_ID = ID.FUND.DEFAULT;

/**
 * Represents the secondary fund identifier for tests.
 */
export const OTHER_FUND_ID = ID.FUND.OTHER;

/**
 * Represents a default position entity linking the default
 * portfolio to the default fund.
 */
export const POSITION = PositionEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    fundId: EntityId.create(ID.FUND.DEFAULT),
  },
  ID.POSITION.DEFAULT,
);

/**
 * Represents a secondary position entity linking the
 * secondary portfolio to the secondary fund.
 */
export const OTHER_POSITION = PositionEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
    fundId: EntityId.create(ID.FUND.OTHER),
  },
  ID.POSITION.OTHER,
);

/**
 * Represents a third position entity linking the default
 * portfolio to the secondary fund.
 */
export const THIRD_POSITION = PositionEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    fundId: EntityId.create(ID.FUND.OTHER),
  },
  ID.POSITION.THIRD,
);

/**
 * Represents a position entity without a predefined
 * identifier. Use this fixture to test insert operations.
 */
export const FRESH_POSITION = PositionEntity.create({
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  fundId: EntityId.create(ID.FUND.DEFAULT),
});

/**
 * Represents a position entity with an initial balance
 * and balance date set. Reuses the default position
 * identifier.
 */
export const UPDATED_POSITION = PositionEntity.create(
  {
    portfolioId: POSITION.portfolioId,
    fundId: POSITION.fundId,
    initialBalance: PositiveMoney.create("5000.00"),
    initialBalanceDate: new Date(
      "2026-01-10T00:00:00.000Z",
    ),
  },
  ID.POSITION.DEFAULT,
);

/**
 * Creates an in-memory repository that implements
 * {@link IPosition}.
 *
 * The repository stores {@link PositionEntity} entities in
 * memory and supports find, save, and delete operations.
 *
 * @returns A new in-memory `IPosition` repository
 *          instance.
 */
export function createInMemoryPositionRepository(): IPosition {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IPosition["save"]>>>(
    { extractId: (p) => p.id },
  );

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPortfolioId(portfolioId) {
      return BASE.match((p) => p.portfolioId === portfolioId);
    },
    async findAllByPortfolioIds(portfolioIds) {
      return BASE.match((p) =>
        portfolioIds.includes(p.portfolioId),
      );
    },
    async findByPortfolioIdAndFundId(portfolioId, fundId) {
      return BASE.findOne(
        (p) =>
          p.portfolioId === portfolioId &&
          p.fundId === fundId,
      );
    },
    save: (position) => BASE.save(position),
    delete: (id) => BASE.delete(id),
  };
}
