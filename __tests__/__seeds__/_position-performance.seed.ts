import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { PositionPerformance } from "@/business/entities";
import { PositionPerformance as PositionPerformanceEntity } from "@/business/entities/performance/position-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { positionPerformance } from "@/infrastructure/database/schemas";
import { seedPositionById } from "./_position.seed";

/**
 * Represents the default performance date for test fixtures.
 * Set to 2026-01-05.
 */
export const PERFORMANCE_DATE =
  new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a duplicate performance date for test fixtures.
 * Set to 2026-01-15. Used to test unique constraint behavior
 * within the same position.
 */
export const PERFORMANCE_DUPLICATE_DATE =
  new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents a February performance date for test fixtures.
 * Set to 2026-02-05. Used for cross-month comparison tests.
 */
export const FEBRUARY_PERFORMANCE_DATE =
  new Date("2026-02-05T00:00:00.000Z");

/**
 * Represents a default position performance fixture.
 * The fixture belongs to the default position at
 * `PERFORMANCE_DATE`. It holds `1000` quotas and has a
 * patrimony of `100000.00`.
 */
export const POSITION_PERFORMANCE =
  PositionPerformanceEntity.create(
    {
      positionId: EntityId.create(ID.POSITION.DEFAULT),
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
    ID.POSITION_PERFORMANCE.DEFAULT,
  );

/**
 * Represents an alternate position performance fixture.
 * The fixture belongs to the other position at
 * `FEBRUARY_PERFORMANCE_DATE`. It holds `500` quotas and has
 * a patrimony of `50000.00`.
 */
export const OTHER_POSITION_PERFORMANCE =
  PositionPerformanceEntity.create(
    {
      positionId: EntityId.create(ID.POSITION.OTHER),
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
    ID.POSITION_PERFORMANCE.OTHER,
  );

/**
 * Represents an external position performance fixture.
 * The fixture belongs to the default position at
 * `PERFORMANCE_DUPLICATE_DATE`. It holds `1100` quotas and
 * has a patrimony of `110000.00`.
 */
export const EXTERNAL_POSITION_PERFORMANCE =
  PositionPerformanceEntity.create(
    {
      positionId: EntityId.create(ID.POSITION.DEFAULT),
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
    ID.POSITION_PERFORMANCE.EXTERNAL,
  );

/**
 * Represents a position performance fixture that falls
 * outside the default test period. The fixture belongs to the
 * default position at 2026-03-01 with a patrimony of
 * `120000.00`.
 */
export const PERIOD_OUTSIDE_POSITION_PERFORMANCE =
  PositionPerformanceEntity.create(
    {
      positionId: EntityId.create(ID.POSITION.DEFAULT),
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
    ID.POSITION_PERFORMANCE.PERIOD_OUTSIDE,
  );

/**
 * Represents an updated position performance fixture.
 * The fixture uses the default performance ID but has an
 * increased patrimony of `125000.00` and earnings of
 * `7500.00`.
 */
export const UPDATED_POSITION_PERFORMANCE =
  PositionPerformanceEntity.create(
    {
      positionId: EntityId.create(ID.POSITION.DEFAULT),
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
    ID.POSITION_PERFORMANCE.DEFAULT,
  );

/**
 * Represents a fresh position performance fixture.
 * The fixture has no persisted ID. It belongs to the default
 * position at 2026-04-05 with a patrimony of `130000.00`.
 */
export const FRESH_POSITION_PERFORMANCE =
  PositionPerformanceEntity.create({
    positionId: EntityId.create(ID.POSITION.DEFAULT),
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

/**
 * Represents the default position performance identifier
 * for test fixtures.
 */
export const POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.DEFAULT;

/**
 * Represents the alternate position performance identifier
 * for test fixtures.
 */
export const OTHER_POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.OTHER;

/**
 * Represents the external position performance identifier
 * for test fixtures.
 */
export const EXTERNAL_POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.EXTERNAL;

/**
 * Represents the period-outside position performance
 * identifier for test fixtures.
 */
export const PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.PERIOD_OUTSIDE;

/**
 * Converts a {@link PositionPerformance} entity to a database
 * insert row.
 *
 * @param entity - The position performance entity to convert.
 * @returns The database-compatible insert row.
 */
function toPositionPerformanceRow(
  entity: PositionPerformance,
): typeof positionPerformance.$inferInsert {
  return {
    positionId: entity.positionId,
    date: entity.date,
    quotasHeld: entity.quotasHeld.value.toString(),
    patrimony: entity.patrimony.value.toString(),
    applicationTotal:
      entity.applicationTotal.value.toString(),
    redemptionTotal:
      entity.redemptionTotal.value.toString(),
    cashFlowNet: entity.cashFlowNet.value.toString(),
    earnings: entity.earnings.value.toString(),
    returnDaily: entity.returnDaily.value.toString(),
    returnMonthly:
      entity.returnMonthly?.value.toString() ?? null,
    returnYearly:
      entity.returnYearly?.value.toString() ?? null,
    returnLast12m:
      entity.returnLast12m?.value.toString() ?? null,
    allocation: entity.allocation.value.toString(),
    createdAt: entity.createdAt,
  };
}

/**
 * Inserts a single {@link PositionPerformance} row into the
 * database.
 *
 * @param entity - The position performance entity to insert.
 */
async function seedPositionPerformanceRow(
  entity: PositionPerformance,
): Promise<void> {
  await db
    .insert(positionPerformance)
    .values({
      ...toPositionPerformanceRow(entity),
      id: entity.id,
    });
}

/**
 * Seeds the default and alternate position performances
 * into the database.
 *
 * The function first seeds the default and alternate
 * positions. It then inserts both performance rows.
 *
 * @returns An array containing the default and alternate
 *          {@link PositionPerformance} fixtures.
 */
export async function seedPositionPerformances(): Promise<
  PositionPerformance[]
> {
  await seedPositionById(ID.POSITION.DEFAULT);
  await seedPositionById(ID.POSITION.OTHER);

  await Promise.all([
    seedPositionPerformanceRow(POSITION_PERFORMANCE),
    seedPositionPerformanceRow(
      OTHER_POSITION_PERFORMANCE,
    ),
  ]);

  return [
    POSITION_PERFORMANCE,
    OTHER_POSITION_PERFORMANCE,
  ];
}

/**
 * Seeds all position performance fixtures into the database.
 *
 * The function first seeds the default and alternate
 * positions. It then inserts all four performance rows:
 * default, external, period-outside, and alternate.
 *
 * @returns The full array of {@link PositionPerformance}
 *          fixtures.
 */
export async function seedAllPositionPerformances(): Promise<
  PositionPerformance[]
> {
  await seedPositionById(ID.POSITION.DEFAULT);
  await seedPositionById(ID.POSITION.OTHER);

  await Promise.all([
    seedPositionPerformanceRow(POSITION_PERFORMANCE),
    seedPositionPerformanceRow(
      EXTERNAL_POSITION_PERFORMANCE,
    ),
    seedPositionPerformanceRow(
      PERIOD_OUTSIDE_POSITION_PERFORMANCE,
    ),
    seedPositionPerformanceRow(
      OTHER_POSITION_PERFORMANCE,
    ),
  ]);

  return [
    POSITION_PERFORMANCE,
    EXTERNAL_POSITION_PERFORMANCE,
    PERIOD_OUTSIDE_POSITION_PERFORMANCE,
    OTHER_POSITION_PERFORMANCE,
  ];
}
