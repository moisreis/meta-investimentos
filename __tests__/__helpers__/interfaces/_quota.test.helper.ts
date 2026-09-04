import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Quota } from "@/business/entities/fund/quota.entity";
import type {
  IQuota,
  UpsertQuota,
  UpsertQuotaResult,
} from "@/business/interfaces/fund/quota.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

/**
 * Represents the January quota date used as the primary
 * test date.
 */
const QUOTA_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a January date that shares the same month as
 * {@link QUOTA_DATE} but a different day.
 */
const QUOTA_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents the February quota date.
 */
const FEBRUARY_QUOTA_DATE = new Date("2026-02-05T00:00:00.000Z");

/**
 * Represents a default quota entity with a price of
 * `1000.00` in January 2026.
 */
const QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.DEFAULT),
    date: QUOTA_DATE,
    price: QuotaPrice.create("1000.00"),
  },
  ID.QUOTA.DEFAULT,
);

/**
 * Represents a secondary quota entity with a price of
 * `500.00` in February 2026.
 */
const OTHER_QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.OTHER),
    date: FEBRUARY_QUOTA_DATE,
    price: QuotaPrice.create("500.00"),
  },
  ID.QUOTA.OTHER,
);

/**
 * Represents an external quota entity that shares the
 * default fund and January month.
 */
const EXTERNAL_QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.DEFAULT),
    date: QUOTA_DUPLICATE_DATE,
    price: QuotaPrice.create("1010.50"),
  },
  ID.QUOTA.EXTERNAL,
);

/**
 * Represents a quota entity dated outside the default test
 * period. The date is March 2026.
 */
const PERIOD_OUTSIDE_QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.DEFAULT),
    date: new Date("2026-03-01T00:00:00.000Z"),
    price: QuotaPrice.create("1020.00"),
  },
  ID.QUOTA.PERIOD_OUTSIDE,
);

/**
 * Represents a quota entity with an updated price. Reuses
 * the default quota identifier.
 */
const UPDATED_QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.DEFAULT),
    date: QUOTA_DATE,
    price: QuotaPrice.create("1050.00"),
  },
  ID.QUOTA.DEFAULT,
);

/**
 * Represents a quota entity without a predefined
 * identifier. The date is April 2026.
 */
const FRESH_QUOTA = Quota.create({
  fundId: EntityId.create(ID.FUND.DEFAULT),
  date: new Date("2026-04-05T00:00:00.000Z"),
  price: QuotaPrice.create("1030.00"),
});

/**
 * Represents the {@link QUOTA_DATE} re-exported for
 * convenience.
 */
/**
 * Represents the {@link QUOTA_DUPLICATE_DATE} re-exported
 * for convenience.
 */
/**
 * Represents the {@link FEBRUARY_QUOTA_DATE} re-exported
 * for convenience.
 */
/**
 * Represents the default quota entity re-exported for
 * convenience.
 */
/**
 * Represents the secondary quota entity re-exported for
 * convenience.
 */
/**
 * Represents the external quota entity re-exported for
 * convenience.
 */
/**
 * Represents the period-outside quota entity re-exported
 * for convenience.
 */
/**
 * Represents the updated quota entity re-exported for
 * convenience.
 */
/**
 * Represents the fresh quota entity re-exported for
 * convenience.
 */
export {
  QUOTA_DATE,
  QUOTA_DUPLICATE_DATE,
  FEBRUARY_QUOTA_DATE,
  QUOTA,
  OTHER_QUOTA,
  EXTERNAL_QUOTA,
  PERIOD_OUTSIDE_QUOTA,
  UPDATED_QUOTA,
  FRESH_QUOTA,
};

/**
 * Represents a fixed identifier for the earlier quota
 * entity.
 */
const QUOTA_ID_TWO = "c1c2c3c4-c5c6-4c7c-8c9c-0c1c2c3c4c5c";

/**
 * Represents a fixed identifier for the latest quota
 * entity.
 */
const QUOTA_ID_THREE = "d1d2d3d4-d5d6-4d7d-8d9d-0d1d2d3d4d5d";

/**
 * Represents the default quota identifier for tests.
 */
export const QUOTA_ID = ID.QUOTA.DEFAULT;

/**
 * Represents the default fund identifier referenced by
 * {@link QUOTA}.
 */
export const FUND_ID = ID.FUND.DEFAULT;

/**
 * Represents a quota entity dated earlier than the
 * default. The date is January 1, 2026.
 */
export const EARLIER_QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.DEFAULT),
    date: new Date("2026-01-01T12:00:00.000Z"),
    price: QuotaPrice.create("10.00"),
  },
  QUOTA_ID_TWO,
);

/**
 * Represents a quota entity dated later than the default.
 * The date is January 31, 2026.
 */
export const LATEST_QUOTA = Quota.create(
  {
    fundId: EntityId.create(ID.FUND.DEFAULT),
    date: new Date("2026-01-31T12:00:00.000Z"),
    price: QuotaPrice.create("11.00"),
  },
  QUOTA_ID_THREE,
);

/**
 * Creates an in-memory repository that implements
 * {@link IQuota}.
 *
 * The repository stores {@link Quota} entities in memory
 * and supports find, save, and delete operations.
 *
 * @returns A new in-memory `IQuota` repository instance.
 */
export function createInMemoryQuotaRepository(): IQuota {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IQuota["save"]>>>({
    extractId: (q) => q.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByFundId(fundId) {
      return BASE.match((q) => q.fundId === fundId);
    },
    async findByFundIdAndDate(fundId, date) {
      return BASE.findOne(
        (q) => q.fundId === fundId && q.date.getTime() === date.getTime(),
      );
    },
    async findLatestByFundId(fundId) {
      const FOUND = BASE.match((q) => q.fundId === fundId);

      if (FOUND.length === 0) return null;

      return FOUND.reduce((latest, current) =>
        current.date.getTime() > latest.date.getTime() ? current : latest,
      );
    },
    async findAllByFundIds(fundIds) {
      return BASE.match((q) => fundIds.includes(q.fundId));
    },
    async findLatestByFundIds(fundIds) {
      const BY_FUND = new Map<string, Quota>();
      for (const Q of BASE.match((q) => fundIds.includes(q.fundId))) {
        const EXISTING = BY_FUND.get(Q.fundId);
        if (!EXISTING || Q.date.getTime() > EXISTING.date.getTime()) {
          BY_FUND.set(Q.fundId, Q);
        }
      }
      return [...BY_FUND.values()];
    },
    async findAllByFundIdsInPeriod(fundIds, startDate, endDate) {
      return BASE.match(
        (q) =>
          fundIds.includes(q.fundId) &&
          q.date.getTime() >= startDate.getTime() &&
          q.date.getTime() <= endDate.getTime(),
      );
    },
    save: (quota) => BASE.save(quota),
    async upsertMany(records: UpsertQuota[]): Promise<UpsertQuotaResult[]> {
      const RESULTS: UpsertQuotaResult[] = [];

      for (const RECORD of records) {
        const FOUND = await this.findByFundIdAndDate(
          EntityId.create(RECORD.fundId),
          RECORD.date,
        );

        if (FOUND) {
          const UPDATED = FOUND.updatePrice(QuotaPrice.create(RECORD.price));
          await BASE.save(UPDATED);
          RESULTS.push({
            ...RECORD,
            action: "UPDATE",
          });
        } else {
          await BASE.save(
            Quota.create({
              fundId: EntityId.create(RECORD.fundId),
              date: RECORD.date,
              price: QuotaPrice.create(RECORD.price),
            }),
          );
          RESULTS.push({
            ...RECORD,
            action: "INSERT",
          });
        }
      }

      return RESULTS;
    },
    delete: (id) => BASE.delete(id),
  };
}
