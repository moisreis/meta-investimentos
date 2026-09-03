import type { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import type { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a position performance.
 */
export interface PositionPerformanceDto {
  id: EntityId;
  positionId: EntityId;
  date: Date;
  quotasHeld: string;
  patrimony: string;
  applicationTotal: string;
  redemptionTotal: string;
  cashFlowNet: string;
  earnings: string;
  returnDaily: string;
  returnMonthly: string | null;
  returnYearly: string | null;
  returnLast12m: string | null;
  allocation: string;
  createdAt: Date;
}

/**
 * The public representation of a portfolio performance.
 */
export interface PortfolioPerformanceDto {
  id: EntityId;
  portfolioId: EntityId;
  date: Date;
  quotasHeld: string;
  patrimony: string;
  applicationTotal: string;
  redemptionTotal: string;
  cashFlowNet: string;
  earnings: string;
  returnDaily: string;
  returnMonthly: string | null;
  returnYearly: string | null;
  returnLast12m: string | null;
  target: string | null;
  cumulativeTarget: string | null;
  inflationSpread: string | null;
  riskFreeSpread: string | null;
  marketSpread: string | null;
  createdAt: Date;
}

/**
 * Maps a `PositionPerformance` entity to its public DTO representation.
 *
 * @param performance - The position performance entity.
 * @returns The position performance DTO.
 */
export function toPositionPerformanceDto(
  performance: PositionPerformance,
): PositionPerformanceDto {
  return {
    id: performance.id as EntityId,
    positionId: performance.positionId,
    date: performance.date,
    quotasHeld: performance.quotasHeld.value.toString(),
    patrimony: performance.patrimony.value.toString(),
    applicationTotal: performance.applicationTotal.value.toString(),
    redemptionTotal: performance.redemptionTotal.value.toString(),
    cashFlowNet: performance.cashFlowNet.value.toString(),
    earnings: performance.earnings.value.toString(),
    returnDaily: performance.returnDaily.value.toString(),
    returnMonthly: performance.returnMonthly?.value.toString() ?? null,
    returnYearly: performance.returnYearly?.value.toString() ?? null,
    returnLast12m: performance.returnLast12m?.value.toString() ?? null,
    allocation: performance.allocation.value.toString(),
    createdAt: performance.createdAt,
  };
}

/**
 * Maps a `PortfolioPerformance` entity to its public DTO representation.
 *
 * @param performance - The portfolio performance entity.
 * @returns The portfolio performance DTO.
 */
export function toPortfolioPerformanceDto(
  performance: PortfolioPerformance,
): PortfolioPerformanceDto {
  return {
    id: performance.id as EntityId,
    portfolioId: performance.portfolioId,
    date: performance.date,
    quotasHeld: performance.quotasHeld.value.toString(),
    patrimony: performance.patrimony.value.toString(),
    applicationTotal: performance.applicationTotal.value.toString(),
    redemptionTotal: performance.redemptionTotal.value.toString(),
    cashFlowNet: performance.cashFlowNet.value.toString(),
    earnings: performance.earnings.value.toString(),
    returnDaily: performance.returnDaily.value.toString(),
    returnMonthly: performance.returnMonthly?.value.toString() ?? null,
    returnYearly: performance.returnYearly?.value.toString() ?? null,
    returnLast12m: performance.returnLast12m?.value.toString() ?? null,
    target: performance.target?.value.toString() ?? null,
    cumulativeTarget: performance.cumulativeTarget?.value.toString() ?? null,
    inflationSpread: performance.inflationSpread?.value.toString() ?? null,
    riskFreeSpread: performance.riskFreeSpread?.value.toString() ?? null,
    marketSpread: performance.marketSpread?.value.toString() ?? null,
    createdAt: performance.createdAt,
  };
}
