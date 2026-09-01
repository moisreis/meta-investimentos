import { db } from "@/__tests__/__setup__/_database.setup";
import { PortfolioPerformance } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { portfolioPerformance } from "@/infrastructure/database/schemas";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  seedPortfolioById,
} from "./_portfolio.seed";

export const PORTFOLIO_PERFORMANCE_ID = "5c5d6e7f-8a9b-4c0d-9e1f-2a3b4c5d6e7f";
export const OTHER_PORTFOLIO_PERFORMANCE_ID =
  "6d6e7f80-9a0b-4d1e-8f2a-3b4c5d6e7f80";
export const EXTERNAL_PORTFOLIO_PERFORMANCE_ID =
  "7e7f8091-ab0c-4e2f-8a3b-4c5d6e7f8091";
export const PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID =
  "8f8091a2-bc0d-4f3a-9b4c-5d6e7f8091a2";

export const PERFORMANCE_DATE = new Date("2026-01-05T00:00:00.000Z");
export const PERFORMANCE_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_PERFORMANCE_DATE = new Date("2026-02-05T00:00:00.000Z");

export const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
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
  PORTFOLIO_PERFORMANCE_ID,
);

export const OTHER_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
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
  OTHER_PORTFOLIO_PERFORMANCE_ID,
);

export const EXTERNAL_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
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
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
);

export const PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
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
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
);

export const UPDATED_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
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
  PORTFOLIO_PERFORMANCE_ID,
);

export const FRESH_PORTFOLIO_PERFORMANCE = PortfolioPerformance.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
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

async function seedPortfolioPerformanceRow(
  entity: PortfolioPerformance,
): Promise<void> {
  await db
    .insert(portfolioPerformance)
    .values({ ...toPortfolioPerformanceRow(entity), id: entity.id });
}

export async function seedPortfolioPerformances(): Promise<
  PortfolioPerformance[]
> {
  await seedPortfolioById(PORTFOLIO_ID);
  await seedPortfolioById(OTHER_PORTFOLIO_ID);

  await Promise.all([
    seedPortfolioPerformanceRow(PORTFOLIO_PERFORMANCE),
    seedPortfolioPerformanceRow(OTHER_PORTFOLIO_PERFORMANCE),
  ]);

  return [PORTFOLIO_PERFORMANCE, OTHER_PORTFOLIO_PERFORMANCE];
}

export async function seedAllPortfolioPerformances(): Promise<
  PortfolioPerformance[]
> {
  await seedPortfolioById(PORTFOLIO_ID);
  await seedPortfolioById(OTHER_PORTFOLIO_ID);

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
