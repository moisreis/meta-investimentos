import { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import type { IPositionPerformance } from "@/business/interfaces/performance/position-performance.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

export const PERFORMANCE_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
export const POSITION_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";
export const PERFORMANCE_DATE = new Date("2026-08-01T00:00:00.000Z");

export const PERFORMANCE = PositionPerformance.create(
  {
    positionId: EntityId.create(POSITION_ID),
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("100"),
    patrimony: PositiveMoney.create("1000000"),
    applicationTotal: PositiveMoney.create("1000000"),
    redemptionTotal: PositiveMoney.create("0"),
    cashFlowNet: SignedMoney.create("1000000"),
    earnings: SignedMoney.create("0"),
    returnDaily: SignedPercentage.create("0"),
    allocation: SignedPercentage.create("100"),
  },
  PERFORMANCE_ID,
);

export function createInMemoryPositionPerformanceRepository(): IPositionPerformance {
  const ROWS = new Map<string, PositionPerformance>();

  return {
    async findById(id: string): Promise<PositionPerformance | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByPositionId(
      positionId: string,
    ): Promise<PositionPerformance[]> {
      const RESULT: PositionPerformance[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.positionId === positionId) RESULT.push(ROW);
      }

      return RESULT;
    },

    async findByPositionIdAndDate(
      positionId: string,
      date: Date,
    ): Promise<PositionPerformance | null> {
      for (const ROW of ROWS.values()) {
        if (
          ROW.positionId === positionId &&
          ROW.date.getTime() === date.getTime()
        ) {
          return ROW;
        }
      }

      return null;
    },

    async findLatestByPositionId(
      positionId: string,
    ): Promise<PositionPerformance | null> {
      let LATEST: PositionPerformance | null = null;

      for (const ROW of ROWS.values()) {
        if (ROW.positionId !== positionId) continue;
        if (LATEST === null || ROW.date.getTime() > LATEST.date.getTime()) {
          LATEST = ROW;
        }
      }

      return LATEST;
    },

    async save(
      positionPerformance: PositionPerformance,
    ): Promise<PositionPerformance> {
      ROWS.set(positionPerformance.id ?? "generated-id", positionPerformance);

      return positionPerformance;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
