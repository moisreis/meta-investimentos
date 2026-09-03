import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { PortfolioPerformance as PortfolioPerformanceEntity } from "@/business/entities/performance/portfolio-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { IPortfolioPerformance } from "@/business/interfaces/performance/portfolio-performance.interface";

/**
 * Represents the primary performance date.
 *
 * Use this date as the reference date for the default
 * {@link PORTFOLIO_PERFORMANCE} fixture.
 */
export const PERFORMANCE_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a duplicate performance date for the same month.
 *
 * The date `2026-01-15` belongs to the same month as
 * {@link PERFORMANCE_DATE}. Use it in tests that need a
 * second record within the same period.
 */
export const PERFORMANCE_DUPLICATE_DATE = new Date(
  "2026-01-15T00:00:00.000Z",
);

/**
 * Represents a February performance date.
 *
 * The date `2026-02-05` belongs to a different month than
 * {@link PERFORMANCE_DATE}. Use it for cross-month tests.
 */
export const FEBRUARY_PERFORMANCE_DATE = new Date(
  "2026-02-05T00:00:00.000Z",
);

/**
 * Represents the default portfolio performance fixture.
 *
 * The fixture records performance for the default portfolio
 * on {@link PERFORMANCE_DATE} with patrimony of
 * `100000.00` and a target of `12.0%`.
 */
export const PORTFOLIO_PERFORMANCE = PortfolioPerformanceEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("100000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("5000.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("15.0"),
    inflationSpread: SignedPercentage.create("3.0"),
    riskFreeSpread: SignedPercentage.create("1.0"),
    marketSpread: SignedPercentage.create("2.0"),
  },
  ID.PORTFOLIO_PERFORMANCE.DEFAULT,
);

/**
 * Represents a secondary portfolio performance fixture.
 *
 * The fixture records performance for the other portfolio on
 * {@link FEBRUARY_PERFORMANCE_DATE} with patrimony of
 * `50000.00` and a target of `10.0%`.
 */
export const OTHER_PORTFOLIO_PERFORMANCE = PortfolioPerformanceEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
    date: FEBRUARY_PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("500"),
    patrimony: PositiveMoney.create("50000.00"),
    applicationTotal: PositiveMoney.create("30000.00"),
    redemptionTotal: PositiveMoney.create("10000.00"),
    cashFlowNet: SignedMoney.create("20000.00"),
    earnings: SignedMoney.create("2000.00"),
    returnDaily: SignedPercentage.create("0.3"),
    returnMonthly: SignedPercentage.create("1.5"),
    returnYearly: SignedPercentage.create("6.0"),
    returnLast12m: SignedPercentage.create("5.0"),
    target: SignedPercentage.create("10.0"),
    cumulativeTarget: SignedPercentage.create("12.0"),
    inflationSpread: SignedPercentage.create("2.0"),
    riskFreeSpread: SignedPercentage.create("0.5"),
    marketSpread: SignedPercentage.create("1.5"),
  },
  ID.PORTFOLIO_PERFORMANCE.OTHER,
);

/**
 * Represents an external portfolio performance fixture.
 *
 * The fixture shares the default portfolio with
 * {@link PORTFOLIO_PERFORMANCE} but uses
 * {@link PERFORMANCE_DUPLICATE_DATE} and a unique
 * identifier for cross-reference tests.
 */
export const EXTERNAL_PORTFOLIO_PERFORMANCE = PortfolioPerformanceEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    date: PERFORMANCE_DUPLICATE_DATE,
    quotasHeld: QuotaQuantity.create("1100"),
    patrimony: PositiveMoney.create("110000.00"),
    applicationTotal: PositiveMoney.create("55000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("35000.00"),
    earnings: SignedMoney.create("6000.00"),
    returnDaily: SignedPercentage.create("1.0"),
    returnMonthly: SignedPercentage.create("3.0"),
    returnYearly: SignedPercentage.create("11.0"),
    returnLast12m: SignedPercentage.create("9.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("16.0"),
    inflationSpread: SignedPercentage.create("3.5"),
    riskFreeSpread: SignedPercentage.create("1.0"),
    marketSpread: SignedPercentage.create("2.5"),
  },
  ID.PORTFOLIO_PERFORMANCE.EXTERNAL,
);

/**
 * Represents a portfolio performance fixture outside the test period.
 *
 * The fixture date `2026-03-01` falls outside the default
 * period range used in period-filtered query tests.
 */
export const PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE =
  PortfolioPerformanceEntity.create(
    {
      portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
      date: new Date("2026-03-01T00:00:00.000Z"),
      quotasHeld: QuotaQuantity.create("1200"),
      patrimony: PositiveMoney.create("120000.00"),
      applicationTotal: PositiveMoney.create("60000.00"),
      redemptionTotal: PositiveMoney.create("25000.00"),
      cashFlowNet: SignedMoney.create("35000.00"),
      earnings: SignedMoney.create("7000.00"),
      returnDaily: SignedPercentage.create("0.8"),
      returnMonthly: SignedPercentage.create("4.0"),
      returnYearly: SignedPercentage.create("12.0"),
      returnLast12m: SignedPercentage.create("10.0"),
      target: SignedPercentage.create("12.0"),
      cumulativeTarget: SignedPercentage.create("18.0"),
      inflationSpread: SignedPercentage.create("4.0"),
      riskFreeSpread: SignedPercentage.create("1.2"),
      marketSpread: SignedPercentage.create("2.8"),
    },
    ID.PORTFOLIO_PERFORMANCE.PERIOD_OUTSIDE,
  );

/**
 * Represents the default portfolio performance fixture after update.
 *
 * The fixture has a higher patrimony of `120000.00` and
 * earnings of `7000.00` to simulate a mutation of the
 * original record.
 */
export const UPDATED_PORTFOLIO_PERFORMANCE = PortfolioPerformanceEntity.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("120000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("7000.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    target: SignedPercentage.create("12.0"),
    cumulativeTarget: SignedPercentage.create("15.0"),
    inflationSpread: SignedPercentage.create("3.0"),
    riskFreeSpread: SignedPercentage.create("1.0"),
    marketSpread: SignedPercentage.create("2.0"),
  },
  ID.PORTFOLIO_PERFORMANCE.DEFAULT,
);

/**
 * Represents a fresh portfolio performance fixture without a fixed ID.
 *
 * The fixture is useful for create-and-save tests where the
 * repository assigns the identifier.
 */
export const FRESH_PORTFOLIO_PERFORMANCE = PortfolioPerformanceEntity.create({
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  date: new Date("2026-04-05T00:00:00.000Z"),
  quotasHeld: QuotaQuantity.create("1300"),
  patrimony: PositiveMoney.create("130000.00"),
  applicationTotal: PositiveMoney.create("65000.00"),
  redemptionTotal: PositiveMoney.create("25000.00"),
  cashFlowNet: SignedMoney.create("40000.00"),
  earnings: SignedMoney.create("8000.00"),
  returnDaily: SignedPercentage.create("0.9"),
  returnMonthly: SignedPercentage.create("4.5"),
  returnYearly: SignedPercentage.create("13.0"),
  returnLast12m: SignedPercentage.create("11.0"),
  target: SignedPercentage.create("12.0"),
  cumulativeTarget: SignedPercentage.create("20.0"),
  inflationSpread: SignedPercentage.create("4.2"),
  riskFreeSpread: SignedPercentage.create("1.1"),
  marketSpread: SignedPercentage.create("3.1"),
});

/** Represents the default portfolio performance identifier. */
export const PORTFOLIO_PERFORMANCE_ID =
  ID.PORTFOLIO_PERFORMANCE.DEFAULT;

/** Represents the other portfolio performance identifier. */
export const OTHER_PORTFOLIO_PERFORMANCE_ID =
  ID.PORTFOLIO_PERFORMANCE.OTHER;

/** Represents the external portfolio performance identifier. */
export const EXTERNAL_PORTFOLIO_PERFORMANCE_ID =
  ID.PORTFOLIO_PERFORMANCE.EXTERNAL;

/**
 * Represents the portfolio performance identifier outside
 * the test period.
 */
export const PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID =
  ID.PORTFOLIO_PERFORMANCE.PERIOD_OUTSIDE;

/** Represents the default portfolio identifier. */
export const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

/** Represents the other portfolio identifier. */
export const OTHER_PORTFOLIO_ID = ID.PORTFOLIO.OTHER;

/** Alias for {@link PORTFOLIO_PERFORMANCE_ID}. */
export const PERFORMANCE_ID = ID.PORTFOLIO_PERFORMANCE.DEFAULT;

/** Alias for {@link PORTFOLIO_PERFORMANCE}. */
export const PERFORMANCE = PORTFOLIO_PERFORMANCE;

/**
 * Creates an in-memory implementation of the
 * {@link IPortfolioPerformance} repository.
 *
 * The repository stores {@link PortfolioPerformanceEntity}
 * instances in memory. It supports finding by ID, finding
 * all by portfolio ID, finding by portfolio ID and date,
 * finding the latest by portfolio ID, saving, and deleting.
 *
 * @returns A fresh {@link IPortfolioPerformance} instance
 *          backed by an in-memory store.
 */
export function createInMemoryPortfolioPerformanceRepository(): IPortfolioPerformance {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IPortfolioPerformance["save"]>>
  >({ extractId: (pp) => pp.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPortfolioId(portfolioId) {
      return BASE.match((pp) => pp.portfolioId === portfolioId);
    },
    async findByPortfolioIdAndDate(portfolioId, date) {
      return BASE.findOne(
        (pp) =>
          pp.portfolioId === portfolioId &&
          pp.date.getTime() === date.getTime(),
      );
    },
    async findLatestByPortfolioId(portfolioId) {
      const FOUND = BASE.match((pp) => pp.portfolioId === portfolioId);

      if (FOUND.length === 0) return null;

      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (portfolioPerformance) => BASE.save(portfolioPerformance),
    delete: (id) => BASE.delete(id),
  };
}
