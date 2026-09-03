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
