import { ID } from "@/__tests__/__fixtures__/_ids";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Application as ApplicationEntity } from "@/business/entities/portfolio/application.entity";
import type { IApplication } from "@/business/interfaces/portfolio/application.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

/** Represents the default application identifier. */
export const APPLICATION_ID = ID.APPLICATION.DEFAULT;

/** Represents the secondary application identifier. */
export const OTHER_APPLICATION_ID = ID.APPLICATION.OTHER;

/** Represents an external application identifier. */
export const EXTERNAL_APPLICATION_ID = ID.APPLICATION.EXTERNAL;

/** Represents an application identifier outside the test period. */
export const PERIOD_OUTSIDE_APPLICATION_ID = ID.APPLICATION.PERIOD_OUTSIDE;

/** Represents the default position identifier. */
export const POSITION_ID = ID.POSITION.DEFAULT;

/** Represents the secondary position identifier. */
export const OTHER_POSITION_ID = ID.POSITION.OTHER;

/**
 * Represents the default application date.
 *
 * Use this date as the primary date for the default
 * {@link APPLICATION} fixture.
 */
export const APPLICATION_DATE = new Date("2026-01-15T00:00:00.000Z");

/** Represents the secondary application date. */
export const OTHER_APPLICATION_DATE = new Date("2026-02-15T00:00:00.000Z");

/**
 * Represents the default application fixture.
 *
 * The fixture contains a {@link PositiveMoney} amount of
 * `1000.00` and a {@link QuotaQuantity} of `12.345`.
 */
export const APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
  },
  ID.APPLICATION.DEFAULT,
);

/**
 * Represents a secondary application fixture.
 *
 * The fixture contains a {@link PositiveMoney} amount of
 * `500.00` and a {@link QuotaQuantity} of `6.123`.
 */
export const OTHER_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: OTHER_APPLICATION_DATE,
    amount: PositiveMoney.create("500.00"),
    quotas: QuotaQuantity.create("6.123"),
  },
  ID.APPLICATION.OTHER,
);

/**
 * Represents an external application fixture.
 *
 * The fixture belongs to the default position but uses a
 * unique identifier for cross-reference tests.
 */
export const EXTERNAL_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-01-18T00:00:00.000Z"),
    amount: PositiveMoney.create("200.00"),
    quotas: QuotaQuantity.create("2.4"),
  },
  ID.APPLICATION.EXTERNAL,
);

/**
 * Represents an application fixture outside the test period.
 *
 * The fixture date `2026-03-05` falls outside the default
 * period range used in period-filtered query tests.
 */
export const PERIOD_OUTSIDE_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-03-05T00:00:00.000Z"),
    amount: PositiveMoney.create("400.00"),
    quotas: QuotaQuantity.create("4.8"),
  },
  ID.APPLICATION.PERIOD_OUTSIDE,
);

/**
 * Represents the default application fixture after reversal.
 *
 * The fixture contains `reversedAt` and `reversedByUserId`
 * fields set to simulate a completed reversal.
 */
export const UPDATED_APPLICATION = ApplicationEntity.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: APPLICATION_DATE,
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
    reversedAt: new Date("2026-01-30T00:00:00.000Z"),
    reversedByUserId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.APPLICATION.DEFAULT,
);

/**
 * Represents a fresh application fixture without a fixed ID.
 *
 * The fixture is useful for create-and-save tests where the
 * repository assigns the identifier.
 */
export const FRESH_APPLICATION = ApplicationEntity.create({
  positionId: EntityId.create(ID.POSITION.DEFAULT),
  date: new Date("2026-04-15T00:00:00.000Z"),
  amount: PositiveMoney.create("750.00"),
  quotas: QuotaQuantity.create("8.5"),
});

/**
 * Represents the collection of all standard application fixtures.
 *
 * The array contains {@link APPLICATION}, {@link OTHER_APPLICATION},
 * {@link EXTERNAL_APPLICATION}, and
 * {@link PERIOD_OUTSIDE_APPLICATION}.
 */
export const APPLICATIONS = [
  APPLICATION,
  OTHER_APPLICATION,
  EXTERNAL_APPLICATION,
  PERIOD_OUTSIDE_APPLICATION,
];

/**
 * Represents the expected sum of application amounts across
 * the default, other, and external fixtures.
 */
export const APPLICATION_SUM_AMOUNT = PositiveMoney.create("1200.00");

/**
 * Represents the expected sum of quota quantities across
 * the default, other, and external fixtures.
 */
export const APPLICATION_SUM_QUOTAS = QuotaQuantity.create("14.745");

/**
 * Creates an in-memory implementation of the
 * {@link IApplication} repository.
 *
 * The repository stores {@link ApplicationEntity} instances
 * in memory. It supports finding by ID, finding all by
 * position ID, finding by position ID within a date range,
 * saving, and deleting.
 *
 * @returns A fresh {@link IApplication} instance backed by
 *          an in-memory store.
 */
export function createInMemoryApplicationRepository(): IApplication {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IApplication["save"]>>
  >({ extractId: (a) => a.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPositionId(positionId) {
      return BASE.match((a) => a.positionId === positionId);
    },
    async findAllByPositionIdInPeriod(positionId, startDate, endDate) {
      return BASE.match(
        (a) =>
          a.positionId === positionId &&
          a.date.getTime() >= startDate.getTime() &&
          a.date.getTime() <= endDate.getTime(),
      );
    },
    save: (application) => BASE.save(application),
    delete: (id) => BASE.delete(id),
  };
}
