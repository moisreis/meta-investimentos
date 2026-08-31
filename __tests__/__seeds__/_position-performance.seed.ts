import { db } from "@/__tests__/__setup__/_database.setup";
import { PositionPerformance } from "@/business/entities";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { positionPerformance } from "@/infrastructure/database/schemas";
import {
  FEBRUARY_PERFORMANCE_DATE,
  PERFORMANCE_DATE,
  PERFORMANCE_DUPLICATE_DATE,
} from "./_portfolio-performance.seed";
import {
  OTHER_POSITION_ID,
  POSITION_ID,
  seedPositionById,
} from "./_position.seed";

export const POSITION_PERFORMANCE_ID = "9a90a1b2-cd0e-4f3a-9b4c-5d6e7f8091a2";
export const OTHER_POSITION_PERFORMANCE_ID =
  "0b0b1c2d-de0f-4a4b-8c5d-6e7f8091a2b3";
export const EXTERNAL_POSITION_PERFORMANCE_ID =
  "1c1c2d3e-ef0a-4b5c-9d6e-7f8091a2b3c4";
export const PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID =
  "2d2d3e4f-f0ab-4c6d-8e7f-8091a2b3c4d5";

export const POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: POSITION_ID,
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
    allocation: SignedPercentage.create("40.0"),
  },
  POSITION_PERFORMANCE_ID,
);

export const OTHER_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: OTHER_POSITION_ID,
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
    allocation: SignedPercentage.create("60.0"),
  },
  OTHER_POSITION_PERFORMANCE_ID,
);

export const EXTERNAL_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: POSITION_ID,
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
    allocation: SignedPercentage.create("45.0"),
  },
  EXTERNAL_POSITION_PERFORMANCE_ID,
);

export const PERIOD_OUTSIDE_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: POSITION_ID,
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
    allocation: SignedPercentage.create("50.0"),
  },
  PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID,
);

export const UPDATED_POSITION_PERFORMANCE = PositionPerformance.create(
  {
    positionId: POSITION_ID,
    date: PERFORMANCE_DATE,
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("125000.00"),
    applicationTotal: PositiveMoney.create("50000.00"),
    redemptionTotal: PositiveMoney.create("20000.00"),
    cashFlowNet: SignedMoney.create("30000.00"),
    earnings: SignedMoney.create("7500.00"),
    returnDaily: SignedPercentage.create("0.5"),
    returnMonthly: SignedPercentage.create("2.0"),
    returnYearly: SignedPercentage.create("10.0"),
    returnLast12m: SignedPercentage.create("8.0"),
    allocation: SignedPercentage.create("45.0"),
  },
  POSITION_PERFORMANCE_ID,
);

export const FRESH_POSITION_PERFORMANCE = PositionPerformance.create({
  positionId: POSITION_ID,
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
  allocation: SignedPercentage.create("55.0"),
});

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
