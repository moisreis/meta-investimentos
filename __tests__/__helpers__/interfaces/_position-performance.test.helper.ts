import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { PositionPerformance as PositionPerformanceEntity } from "@/business/entities/performance/position-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { IPositionPerformance } from "@/business/interfaces/performance/position-performance.interface";

/**
 * Represents the primary performance date.
 *
 * Use this date as the reference date for the default
 * {@link POSITION_PERFORMANCE} fixture.
 */
export const PERFORMANCE_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a duplicate performance date for the same month.
 *
 * The date `2026-01-15` belongs to the same month as
 * {@link PERFORMANCE_DATE}. Use it in tests that need a
 * second record within the same period.
 */
export const PERFORMANCE_DUPLICATE_DATE = new Date(
  "2026-01-15T00:00:00.000Z",
);

/**
 * Represents a February performance date.
 *
 * The date `2026-02-05` belongs to a different month than
 * {@link PERFORMANCE_DATE}. Use it for cross-month tests.
 */
export const FEBRUARY_PERFORMANCE_DATE = new Date(
  "2026-02-05T00:00:00.000Z",
);

/**
 * Represents the default position performance fixture.
 *
 * The fixture records performance for the default position
 * on {@link PERFORMANCE_DATE} with patrimony of
 * `100000.00` and daily return of `0.5%`.
 */
export const POSITION_PERFORMANCE = PositionPerformanceEntity.create(
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
 * Represents a secondary position performance fixture.
 *
 * The fixture records performance for the other position on
 * {@link FEBRUARY_PERFORMANCE_DATE} with patrimony of
 * `50000.00` and daily return of `0.3%`.
 */
export const OTHER_POSITION_PERFORMANCE = PositionPerformanceEntity.create(
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
 *
 * The fixture shares the default position with
 * {@link POSITION_PERFORMANCE} but uses
 * {@link PERFORMANCE_DUPLICATE_DATE} and a unique
 * identifier for cross-reference tests.
 */
export const EXTERNAL_POSITION_PERFORMANCE = PositionPerformanceEntity.create(
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
 * Represents a position performance fixture outside the test period.
 *
 * The fixture date `2026-03-01` falls outside the default
 * period range used in period-filtered query tests.
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
 * Represents the default position performance fixture after update.
 *
 * The fixture has a higher patrimony of `125000.00` and
 * earnings of `7500.00` to simulate a mutation of the
 * original record.
 */
export const UPDATED_POSITION_PERFORMANCE = PositionPerformanceEntity.create(
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
 * Represents a fresh position performance fixture without a fixed ID.
 *
 * The fixture is useful for create-and-save tests where the
 * repository assigns the identifier.
 */
export const FRESH_POSITION_PERFORMANCE = PositionPerformanceEntity.create({
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

/** Represents the default position performance identifier. */
export const POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.DEFAULT;

/** Represents the other position performance identifier. */
export const OTHER_POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.OTHER;

/** Represents the external position performance identifier. */
export const EXTERNAL_POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.EXTERNAL;

/**
 * Represents the position performance identifier outside
 * the test period.
 */
export const PERIOD_OUTSIDE_POSITION_PERFORMANCE_ID =
  ID.POSITION_PERFORMANCE.PERIOD_OUTSIDE;

/** Represents the default position identifier. */
export const POSITION_ID = ID.POSITION.DEFAULT;

/** Represents the other position identifier. */
export const OTHER_POSITION_ID = ID.POSITION.OTHER;

/** Alias for {@link POSITION_PERFORMANCE_ID}. */
export const PERFORMANCE_ID = ID.POSITION_PERFORMANCE.DEFAULT;

/** Alias for {@link POSITION_PERFORMANCE}. */
export const PERFORMANCE = POSITION_PERFORMANCE;

/**
 * Creates an in-memory implementation of the
 * {@link IPositionPerformance} repository.
 *
 * The repository stores {@link PositionPerformanceEntity}
 * instances in memory. It supports finding by ID, finding
 * all by position ID, finding by position ID and date,
 * finding the latest by position ID, saving, and deleting.
 *
 * @returns A fresh {@link IPositionPerformance} instance
 *          backed by an in-memory store.
 */
export function createInMemoryPositionPerformanceRepository(): IPositionPerformance {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IPositionPerformance["save"]>>
  >({ extractId: (pp) => pp.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPositionId(positionId) {
      return BASE.match((pp) => pp.positionId === positionId);
    },
    async findByPositionIdAndDate(positionId, date) {
      return BASE.findOne(
        (pp) =>
          pp.positionId === positionId && pp.date.getTime() === date.getTime(),
      );
    },
    async findLatestByPositionId(positionId) {
      const FOUND = BASE.match((pp) => pp.positionId === positionId);

      if (FOUND.length === 0) return null;

      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    save: (positionPerformance) => BASE.save(positionPerformance),
    delete: (id) => BASE.delete(id),
  };
}
