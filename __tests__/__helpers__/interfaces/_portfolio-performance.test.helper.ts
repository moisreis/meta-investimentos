import { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import type { IPortfolioPerformance } from "@/business/interfaces/performance/portfolio-performance.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

export const PERFORMANCE_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const PORTFOLIO_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const PERFORMANCE_DATE = new Date("2026-08-01T00:00:00.000Z");

export const PERFORMANCE = PortfolioPerformance.create(
  {
    portfolioId: PORTFOLIO_ID,
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("100"),
    patrimony: PositiveMoney.create("1000000"),
    applicationTotal: PositiveMoney.create("1000000"),
    redemptionTotal: PositiveMoney.create("0"),
    cashFlowNet: SignedMoney.create("1000000"),
    earnings: SignedMoney.create("0"),
    returnDaily: SignedPercentage.create("0"),
  },
  PERFORMANCE_ID,
);

export function createInMemoryPortfolioPerformanceRepository(): IPortfolioPerformance {
  const ROWS = new Map<string, PortfolioPerformance>();

  return {
    async findById(id: string): Promise<PortfolioPerformance | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByPortfolioId(
      portfolioId: string,
    ): Promise<PortfolioPerformance[]> {
      const RESULT: PortfolioPerformance[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId) RESULT.push(ROW);
      }

      return RESULT;
    },

    async findByPortfolioIdAndDate(
      portfolioId: string,
      date: Date,
    ): Promise<PortfolioPerformance | null> {
      for (const ROW of ROWS.values()) {
        if (
          ROW.portfolioId === portfolioId &&
          ROW.date.getTime() === date.getTime()
        ) {
          return ROW;
        }
      }

      return null;
    },

    async findLatestByPortfolioId(
      portfolioId: string,
    ): Promise<PortfolioPerformance | null> {
      let LATEST: PortfolioPerformance | null = null;

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId !== portfolioId) continue;
        if (LATEST === null || ROW.date.getTime() > LATEST.date.getTime()) {
          LATEST = ROW;
        }
      }

      return LATEST;
    },

    async save(
      portfolioPerformance: PortfolioPerformance,
    ): Promise<PortfolioPerformance> {
      ROWS.set(portfolioPerformance.id ?? "generated-id", portfolioPerformance);

      return portfolioPerformance;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
