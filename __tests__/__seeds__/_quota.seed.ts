import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Quota } from "@/business/entities/fund/quota.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { quota } from "@/infrastructure/database/schemas";
import { seedFundById } from "./_fund.seed";

/**
 * Represents the default quota date
 * used in standard test scenarios.
 */
const QUOTA_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents a duplicate quota date
 * for the same fund, used to test
 * uniqueness constraints.
 */
const QUOTA_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents a February quota date used
 * in period-boundary test scenarios.
 */
const FEBRUARY_QUOTA_DATE = new Date("2026-02-05T00:00:00.000Z");

/**
 * Represents the default quota fixture
 * for the standard test fund.
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
 * Represents a quota fixture for the
 * alternate test fund in February.
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
 * Represents a quota fixture for the
 * default fund at a different date.
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
 * Represents a quota fixture whose date
 * falls outside a standard test period.
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
 * Represents a quota fixture with an
 * updated price for the default fund.
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
 * Represents a quota fixture with a
 * generated ID for insert tests.
 */
const FRESH_QUOTA = Quota.create({
  fundId: EntityId.create(ID.FUND.DEFAULT),
  date: new Date("2026-04-05T00:00:00.000Z"),
  price: QuotaPrice.create("1030.00"),
});

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
 * Represents the default quota identifier for tests.
 */
export const QUOTA_ID = ID.QUOTA.DEFAULT;

/**
 * Represents the other quota identifier for tests.
 */
export const OTHER_QUOTA_ID = ID.QUOTA.OTHER;

/**
 * Represents the external quota identifier for tests.
 */
export const EXTERNAL_QUOTA_ID = ID.QUOTA.EXTERNAL;

/**
 * Represents the period-outside quota identifier for tests.
 */
export const PERIOD_OUTSIDE_QUOTA_ID = ID.QUOTA.PERIOD_OUTSIDE;

/**
 * Converts a {@link Quota} entity into a
 * database-compatible insert row.
 */
function toQuotaRow(entity: Quota): typeof quota.$inferInsert {
  return {
    fundId: entity.fundId,
    date: entity.date,
    price: entity.price.value.toString(),
    createdAt: entity.createdAt,
  };
}

/**
 * Seeds the default and alternate quota
 * rows into the database.
 *
 * The function inserts the funds that
 * each quota depends on before inserting
 * the quota rows.
 *
 * @returns The seeded {@link Quota} array.
 */
export async function seedQuotas(): Promise<Quota[]> {
  await seedFundById(ID.FUND.DEFAULT);
  await seedFundById(ID.FUND.OTHER);

  for (const fixture of [QUOTA, OTHER_QUOTA]) {
    await db.insert(quota).values({ ...toQuotaRow(fixture), id: fixture.id });
  }

  return [QUOTA, OTHER_QUOTA];
}

/**
 * Seeds all quota fixtures into the
 * database, including period-outside
 * and external entries.
 *
 * The function inserts the funds that
 * each quota depends on before inserting
 * the quota rows.
 *
 * @returns The full {@link Quota} array.
 */
export async function seedAllQuotas(): Promise<Quota[]> {
  await seedFundById(ID.FUND.DEFAULT);
  await seedFundById(ID.FUND.OTHER);

  for (const fixture of [
    QUOTA,
    EXTERNAL_QUOTA,
    PERIOD_OUTSIDE_QUOTA,
    OTHER_QUOTA,
  ]) {
    await db.insert(quota).values({ ...toQuotaRow(fixture), id: fixture.id });
  }

  return [QUOTA, EXTERNAL_QUOTA, PERIOD_OUTSIDE_QUOTA, OTHER_QUOTA];
}
