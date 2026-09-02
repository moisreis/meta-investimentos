import {
  EXTERNAL_POSITION_PERFORMANCE,
  EXTERNAL_POSITION_PERFORMANCE_ID,
  FRESH_POSITION_PERFORMANCE,
  OTHER_POSITION_ID,
  OTHER_POSITION_PERFORMANCE,
  OTHER_POSITION_PERFORMANCE_ID,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
  POSITION_ID,
  POSITION_PERFORMANCE,
  POSITION_PERFORMANCE_ID,
  UPDATED_POSITION_PERFORMANCE,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { PositionPerformance } from "@/business/entities";
import { positionPerformance } from "@/infrastructure/database/schemas";
import { seedPositionById } from "./_position.seed";

export {
  POSITION_PERFORMANCE_ID,
  OTHER_POSITION_PERFORMANCE_ID,
  EXTERNAL_POSITION_PERFORMANCE_ID,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
  POSITION_PERFORMANCE,
  OTHER_POSITION_PERFORMANCE,
  EXTERNAL_POSITION_PERFORMANCE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE,
  UPDATED_POSITION_PERFORMANCE,
  FRESH_POSITION_PERFORMANCE,
};

function toPositionPerformanceRow(
  entity: PositionPerformance,
): typeof positionPerformance.$inferInsert {
  return {
    positionId: entity.positionId,
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
    allocation: entity.allocation.value.toString(),
    createdAt: entity.createdAt,
  };
}

async function seedPositionPerformanceRow(
  entity: PositionPerformance,
): Promise<void> {
  await db
    .insert(positionPerformance)
    .values({ ...toPositionPerformanceRow(entity), id: entity.id });
}

export async function seedPositionPerformances(): Promise<
  PositionPerformance[]
> {
  await seedPositionById(POSITION_ID);
  await seedPositionById(OTHER_POSITION_ID);

  await Promise.all([
    seedPositionPerformanceRow(POSITION_PERFORMANCE),
    seedPositionPerformanceRow(OTHER_POSITION_PERFORMANCE),
  ]);

  return [POSITION_PERFORMANCE, OTHER_POSITION_PERFORMANCE];
}

export async function seedAllPositionPerformances(): Promise<
  PositionPerformance[]
> {
  await seedPositionById(POSITION_ID);
  await seedPositionById(OTHER_POSITION_ID);

  await Promise.all([
    seedPositionPerformanceRow(POSITION_PERFORMANCE),
    seedPositionPerformanceRow(EXTERNAL_POSITION_PERFORMANCE),
    seedPositionPerformanceRow(PERIOD_OUTSIDE_POSITION_PERFORMANCE),
    seedPositionPerformanceRow(OTHER_POSITION_PERFORMANCE),
  ]);

  return [
    POSITION_PERFORMANCE,
    EXTERNAL_POSITION_PERFORMANCE,
    PERIOD_OUTSIDE_POSITION_PERFORMANCE,
    OTHER_POSITION_PERFORMANCE,
  ];
}
