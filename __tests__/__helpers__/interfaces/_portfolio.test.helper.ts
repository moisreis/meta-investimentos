import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { IPortfolio } from "@/business/interfaces/portfolio/portfolio.interface";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

export const PORTFOLIO_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const USER_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const OTHER_USER_ID = "c47d54e2-4a03-4f71-9c0d-3a58d2c33e90";

export const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: USER_ID,
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  PORTFOLIO_ID,
);

export function createInMemoryPortfolioRepository(): IPortfolio {
  const ROWS = new Map<string, Portfolio>();

  return {
    async findById(id: string): Promise<Portfolio | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByUserId(userId: string): Promise<Portfolio[]> {
      const MATCHES: Portfolio[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.userId === userId) MATCHES.push(ROW);
      }

      return MATCHES;
    },

    async save(portfolio: Portfolio): Promise<Portfolio> {
      ROWS.set(portfolio.id ?? "generated-id", portfolio);

      return portfolio;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
