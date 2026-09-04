import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The portfolio summary for a reference date.
 */
export interface PortfolioSummaryDto {
  portfolioId: EntityId;
  referenceDate: Date;
  totalPatrimony: string;
  totalQuotasHeld: string;
  totalApplications: string;
  totalWithdrawals: string;
  netCashFlow: string;
  earnings: string;
  positionCount: number;
}

/**
 * A single position's compliance status against a norm.
 */
export interface PositionComplianceDto {
  positionId: EntityId;
  fundId: EntityId;
  currentAllocation: string;
  normMinAllocation: string | null;
  normMaxAllocation: string | null;
  normTargetAllocation: string | null;
  compliant: boolean;
}

/**
 * The portfolio compliance report.
 */
export interface PortfolioComplianceDto {
  portfolioId: EntityId;
  positions: PositionComplianceDto[];
  overallCompliant: boolean;
  violations: Array<{
    positionId: EntityId;
    reason: string;
  }>;
}

/**
 * A summary of the portfolio's allocation positions.
 */
export interface AllocationSeriesPointDto {
  positionId: EntityId;
  fundId: EntityId;
  allocation: string;
  patrimony: string;
}

/**
 * The portfolio dashboard data.
 */
export interface PortfolioDashboardDto {
  portfolioId: EntityId;
  referenceDate: Date;
  totalPatrimony: string;
  totalEarnings: string;
  allocationSeries: AllocationSeriesPointDto[];
  recentApplications: number;
  recentWithdrawals: number;
}

/**
 * A single application or withdrawal in a portfolio's transaction
 * history.
 */
export interface PortfolioTransactionDto {
  id: EntityId;
  positionId: EntityId;
  fundId: EntityId;
  kind: "application" | "withdrawal";
  date: Date;
  amount: string;
  quotas: string;
  reversedAt: Date | null;
}

/**
 * The transaction history of a portfolio.
 */
export interface PortfolioTransactionHistoryDto {
  portfolioId: EntityId;
  transactions: PortfolioTransactionDto[];
}

/**
 * A single position's valuation in a portfolio market value snapshot.
 */
export interface PortfolioMarketValuePositionDto {
  positionId: EntityId;
  fundId: EntityId;
  quotasHeld: string;
  quotaPrice: string | null;
  marketValue: string;
}

/**
 * The total market value of a portfolio on a reference date.
 */
export interface PortfolioMarketValueDto {
  portfolioId: EntityId;
  referenceDate: Date;
  totalMarketValue: string;
  positionCount: number;
  positions: PortfolioMarketValuePositionDto[];
}
