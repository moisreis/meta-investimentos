import {
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
  FEBRUARY_PERFORMANCE_DATE,
  FRESH_PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_ID,
  OTHER_PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_PERFORMANCE_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
  PORTFOLIO_ID,
  PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE_ID,
  UPDATED_PORTFOLIO_PERFORMANCE,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { PortfolioPerformance } from "@/business/entities";
import { portfolioPerformance } from "@/infrastructure/database/schemas";
import { seedPortfolioById } from "./_portfolio.seed";

export {
  PORTFOLIO_PERFORMANCE_ID,
  OTHER_PORTFOLIO_PERFORMANCE_ID,
  EXTERNAL_PORTFOLIO_PERFORMANCE_ID,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE_ID,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
  FEBRUARY_PERFORMANCE_DATE,
  PORTFOLIO_PERFORMANCE,
  OTHER_PORTFOLIO_PERFORMANCE,
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
  UPDATED_PORTFOLIO_PERFORMANCE,
  FRESH_PORTFOLIO_PERFORMANCE,
};

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
