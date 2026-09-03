import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { ID } from "@/__tests__/__fixtures__/_ids";
import type { IWithdrawal } from "@/business/interfaces/portfolio/withdrawal.interface";
import { Withdrawal as WithdrawalEntity } from "@/business/entities/portfolio/withdrawal.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/** Represents the default withdrawal identifier. */
export const WITHDRAWAL_ID = ID.WITHDRAWAL.DEFAULT;

/** Represents the secondary withdrawal identifier. */
export const OTHER_WITHDRAWAL_ID = ID.WITHDRAWAL.OTHER;

/** Represents an external withdrawal identifier. */
export const EXTERNAL_WITHDRAWAL_ID = ID.WITHDRAWAL.EXTERNAL;

/** Represents a withdrawal identifier outside the test period. */
export const PERIOD_OUTSIDE_WITHDRAWAL_ID = ID.WITHDRAWAL.PERIOD_OUTSIDE;

/** Represents the default position identifier. */
export const POSITION_ID = ID.POSITION.DEFAULT;

/** Represents the secondary position identifier. */
export const OTHER_POSITION_ID = ID.POSITION.OTHER;

/**
 * Represents the default withdrawal date.
 *
 * Use this date as the primary date for the default
 * {@link WITHDRAWAL} fixture.
 */
export const WITHDRAWAL_DATE = new Date("2026-01-20T00:00:00.000Z");

/** Represents the secondary withdrawal date. */
export const OTHER_WITHDRAWAL_DATE = new Date("2026-02-20T00:00:00.000Z");

/**
 * Represents the default withdrawal fixture.
 *
 * The fixture contains a {@link PositiveMoney} amount of
 * `500.00` and a {@link QuotaQuantity} of `6.123`.
 */
export const WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  ID.WITHDRAWAL.DEFAULT,
);

/**
 * Represents a secondary withdrawal fixture.
 *
 * The fixture contains a {@link PositiveMoney} amount of
 * `250.00` and a {@link QuotaQuantity} of `3.0615`.
 */
export const OTHER_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: OTHER_WITHDRAWAL_DATE,
    amount: PositiveMoney.create("250.00"),
    quotas: QuotaQuantity.create("3.0615"),
  },
  ID.WITHDRAWAL.OTHER,
);

/**
 * Represents an external withdrawal fixture.
 *
 * The fixture belongs to the default position but uses a
 * unique identifier for cross-reference tests.
 */
export const EXTERNAL_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-01-22T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("1.2"),
  },
  ID.WITHDRAWAL.EXTERNAL,
);

/**
 * Represents a withdrawal fixture outside the test period.
 *
 * The fixture date `2026-03-10` falls outside the default
 * period range used in period-filtered query tests.
 */
export const PERIOD_OUTSIDE_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-03-10T00:00:00.000Z"),
    amount: PositiveMoney.create("150.00"),
    quotas: QuotaQuantity.create("1.8"),
  },
  ID.WITHDRAWAL.PERIOD_OUTSIDE,
);

/**
 * Represents the default withdrawal fixture after reversal.
 *
 * The fixture contains `reversedAt` and `reversedByUserId`
 * fields set to simulate a completed reversal.
 */
export const UPDATED_WITHDRAWAL = WithdrawalEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: WITHDRAWAL_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
    reversedAt: new Date("2026-02-01T00:00:00.000Z"),
    reversedByUserId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.WITHDRAWAL.DEFAULT,
);

/**
 * Represents a fresh withdrawal fixture without a fixed ID.
 *
 * The fixture is useful for create-and-save tests where the
 * repository assigns the identifier.
 */
export const FRESH_WITHDRAWAL = WithdrawalEntity.create({
  positionId: EntityId.create(ID.POSITION.DEFAULT),
  date: new Date("2026-04-20T00:00:00.000Z"),
  amount: PositiveMoney.create("300.00"),
  quotas: QuotaQuantity.create("3.4"),
});

/**
 * Represents the collection of all standard withdrawal fixtures.
 *
 * The array contains {@link WITHDRAWAL}, {@link OTHER_WITHDRAWAL},
 * {@link EXTERNAL_WITHDRAWAL}, and
 * {@link PERIOD_OUTSIDE_WITHDRAWAL}.
 */
export const WITHDRAWALS = [
  WITHDRAWAL,
  OTHER_WITHDRAWAL,
  EXTERNAL_WITHDRAWAL,
  PERIOD_OUTSIDE_WITHDRAWAL,
];

/**
 * Represents the expected sum of withdrawal amounts across
 * the default, other, and external fixtures.
 */
export const WITHDRAWAL_SUM_AMOUNT = PositiveMoney.create("600.00");

/**
 * Represents the expected sum of quota quantities across
 * the default, other, and external fixtures.
 */
export const WITHDRAWAL_SUM_QUOTAS = QuotaQuantity.create("7.323");

/**
 * Creates an in-memory implementation of the
 * {@link IWithdrawal} repository.
 *
 * The repository stores {@link WithdrawalEntity} instances
 * in memory. It supports finding by ID, finding all by
 * position ID, finding by position ID within a date range,
 * saving, and deleting.
 *
 * @returns A fresh {@link IWithdrawal} instance backed by
 *          an in-memory store.
 */
export function createInMemoryWithdrawalRepository(): IWithdrawal {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IWithdrawal["save"]>>
  >({ extractId: (w) => w.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPositionId(positionId) {
      return BASE.match((w) => w.positionId === positionId);
    },
    async findAllByPositionIdInPeriod(positionId, startDate, endDate) {
      return BASE.match(
        (w) =>
          w.positionId === positionId &&
          w.date.getTime() >= startDate.getTime() &&
          w.date.getTime() <= endDate.getTime(),
      );
    },
    save: (withdrawal) => BASE.save(withdrawal),
    delete: (id) => BASE.delete(id),
  };
}
