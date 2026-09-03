import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { IPortfolio } from "@/business/interfaces/portfolio/portfolio.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents a default portfolio entity for the FIA
 * strategy with allocation bounds configured.
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
 * Represents a secondary portfolio entity for the RF
 * strategy owned by a different user.
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
 * Represents a third portfolio entity for the CMB strategy
 * owned by the default user.
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
 * Represents a portfolio entity without a predefined
 * identifier. Use this fixture to test insert operations.
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
 * Represents a portfolio entity with an updated target
 * allocation. Reuses the default portfolio identifier.
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

/**
 * Represents the default portfolio entity re-exported for
 * convenience.
 */
/**
 * Represents the secondary portfolio entity re-exported
 * for convenience.
 */
/**
 * Represents the third portfolio entity re-exported for
 * convenience.
 */
/**
 * Represents the fresh portfolio entity re-exported for
 * convenience.
 */
/**
 * Represents the updated portfolio entity re-exported for
 * convenience.
 */
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
 * Represents the default user identifier referenced by
 * {@link PORTFOLIO}.
 */
export const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the other user identifier referenced by
 * {@link OTHER_PORTFOLIO}.
 */
export const OTHER_USER_ID = ID.USER.OTHER;

/**
 * Creates an in-memory repository that implements
 * {@link IPortfolio}.
 *
 * The repository stores {@link Portfolio} entities in
 * memory and supports find, save, and delete operations.
 *
 * @returns A new in-memory `IPortfolio` repository
 *          instance.
 */
export function createInMemoryPortfolioRepository(): IPortfolio {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IPortfolio["save"]>>
  >({ extractId: (p) => p.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByUserId(userId) {
      return BASE.match((p) => p.userId === userId);
    },
    save: (portfolio) => BASE.save(portfolio),
    delete: (id) => BASE.delete(id),
  };
}
