import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { PortfolioPerformance } from "@/business/entities";
import { PortfolioPerformance as PortfolioPerformanceEntity } from "@/business/entities/performance/portfolio-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { portfolioPerformance } from "@/infrastructure/database/schemas";
import { seedPortfolioById } from "./_portfolio.seed";

/**
 * Represents the default performance date for test fixtures.
 * Set to 2026-01-05.
 */
export const PERFORMANCE_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a duplicate performance date for test fixtures.
 * Set to 2026-01-15. Used to test unique constraint behavior
 * within the same portfolio.
 */
export const PERFORMANCE_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents a February performance date for test fixtures.
 * Set to 2026-02-05. Used for cross-month comparison tests.
 */
export const FEBRUARY_PERFORMANCE_DATE = new Date("2026-02-05T00:00:00.000Z");

/**
 * Represents a default portfolio performance fixture.
 * The fixture belongs to the default portfolio at
 * `PERFORMANCE_DATE`. It holds `1000` quotas and has a
 * patrimony of `100000.00`.
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
 * Represents an alternate portfolio performance fixture.
 * The fixture belongs to the other portfolio at
 * `FEBRUARY_PERFORMANCE_DATE`. It holds `500` quotas and has
 * a patrimony of `50000.00`.
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
 * The fixture belongs to the default portfolio at
 * `PERFORMANCE_DUPLICATE_DATE`. It holds `1100` quotas and
 * has a patrimony of `110000.00`.
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
 * Represents a portfolio performance fixture that falls
 * outside the default test period. The fixture belongs to the
 * default portfolio at 2026-03-01 with a patrimony of
 * `120000.00`.
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
 * Represents an updated portfolio performance fixture.
 * The fixture uses the default performance ID but has an
 * increased patrimony of `120000.00` and earnings of
 * `7000.00`.
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
 * Represents a fresh portfolio performance fixture.
 * The fixture has no persisted ID. It belongs to the default
 * portfolio at 2026-04-05 with a patrimony of `130000.00`.
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

/**
 * Represents the default portfolio performance identifier
 * for test fixtures.
 */
export const PORTFOLIO_PERFORMANCE_ID = ID.PORTFOLIO_PERFORMANCE.DEFAULT;

/**
 * Represents the alternate portfolio performance identifier
 * for test fixtures.
 */
export const OTHER_PORTFOLIO_PERFORMANCE_ID = ID.PORTFOLIO_PERFORMANCE.OTHER;

/**
 * Represents the external portfolio performance identifier
 * for test fixtures.
 */
export const EXTERNAL_PORTFOLIO_PERFORMANCE_ID =
  ID.PORTFOLIO_PERFORMANCE.EXTERNAL;

/**
 * Represents the period-outside portfolio performance
 * identifier for test fixtures.
 */
export const PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID =
  ID.PORTFOLIO_PERFORMANCE.PERIOD_OUTSIDE;

/**
 * Converts a {@link PortfolioPerformance} entity to a database
 * insert row.
 *
 * @param entity - The portfolio performance entity to convert.
 * @returns The database-compatible insert row.
 */
function toPortfolioPerformanceRow(
  entity: PortfolioPerformance,
): typeof portfolioPerformance.$inferInsert {
  return {
    portfolioId: entity.portfolioId,
    date: entity.date,
    quotasHeld: entity.quotasHeld.value.toString(),
    patrimony: entity.patrimony.value.toString(),
    applicationTotal: entity.applicationTotal.value.toString(),
    redemptionTotal: entity.redemptionTotal.value.toString(),
    cashFlowNet: entity.cashFlowNet.value.toString(),
    earnings: entity.earnings.value.toString(),
    returnDaily: entity.returnDaily.value.toString(),
    returnMonthly: entity.returnMonthly?.value.toString() ?? null,
    returnYearly: entity.returnYearly?.value.toString() ?? null,
    returnLast12m: entity.returnLast12m?.value.toString() ?? null,
    target: entity.target?.value.toString() ?? null,
    cumulativeTarget: entity.cumulativeTarget?.value.toString() ?? null,
    inflationSpread: entity.inflationSpread?.value.toString() ?? null,
    riskFreeSpread: entity.riskFreeSpread?.value.toString() ?? null,
    marketSpread: entity.marketSpread?.value.toString() ?? null,
    createdAt: entity.createdAt,
  };
}

/**
 * Inserts a single {@link PortfolioPerformance} row into the
 * database.
 *
 * @param entity - The portfolio performance entity to insert.
 */
async function seedPortfolioPerformanceRow(
  entity: PortfolioPerformance,
): Promise<void> {
  await db.insert(portfolioPerformance).values({
    ...toPortfolioPerformanceRow(entity),
    id: entity.id,
  });
}

/**
 * Seeds the default and alternate portfolio performances
 * into the database.
 *
 * The function first seeds the default and alternate
 * portfolios. It then inserts both performance rows.
 *
 * @returns An array containing the default and alternate
 *          {@link PortfolioPerformance} fixtures.
 */
export async function seedPortfolioPerformances(): Promise<
  PortfolioPerformance[]
> {
  await seedPortfolioById(ID.PORTFOLIO.DEFAULT);
  await seedPortfolioById(ID.PORTFOLIO.OTHER);

  await Promise.all([
    seedPortfolioPerformanceRow(PORTFOLIO_PERFORMANCE),
    seedPortfolioPerformanceRow(OTHER_PORTFOLIO_PERFORMANCE),
  ]);

  return [PORTFOLIO_PERFORMANCE, OTHER_PORTFOLIO_PERFORMANCE];
}

/**
 * Seeds all portfolio performance fixtures into the database.
 *
 * The function first seeds the default and alternate
 * portfolios. It then inserts all four performance rows:
 * default, external, period-outside, and alternate.
 *
 * @returns The full array of {@link PortfolioPerformance}
 *          fixtures.
 */
export async function seedAllPortfolioPerformances(): Promise<
  PortfolioPerformance[]
> {
  await seedPortfolioById(ID.PORTFOLIO.DEFAULT);
  await seedPortfolioById(ID.PORTFOLIO.OTHER);

  await Promise.all([
    seedPortfolioPerformanceRow(PORTFOLIO_PERFORMANCE),
    seedPortfolioPerformanceRow(EXTERNAL_PORTFOLIO_PERFORMANCE),
    seedPortfolioPerformanceRow(PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE),
    seedPortfolioPerformanceRow(OTHER_PORTFOLIO_PERFORMANCE),
  ]);

  return [
    PORTFOLIO_PERFORMANCE,
    EXTERNAL_PORTFOLIO_PERFORMANCE,
    PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
    OTHER_PORTFOLIO_PERFORMANCE,
  ];
}
