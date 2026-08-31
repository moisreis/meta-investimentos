import { db } from "@/__tests__/__setup__/_database.setup";
import { Quota } from "@/business/entities";
import QuotaPrice from "@/business/value-objects/quota-price.vo";
import { quota } from "@/infrastructure/database/schemas";
import { FUND_ID, OTHER_FUND_ID, seedFundById } from "./_fund.seed";

export const QUOTA_ID = "cd12ef01-2345-4afe-6789-01abcdef0123";
export const OTHER_QUOTA_ID = "de23f012-3456-4afe-789a-12bcdef01234";
export const EXTERNAL_QUOTA_ID = "ef34f012-3456-4afe-89ab-23cdef012345";
export const PERIOD_OUTSIDE_QUOTA_ID = "f045f123-4567-4afe-9abc-34def0123456";

export const QUOTA_DATE = new Date("2026-01-05T00:00:00.000Z");
export const QUOTA_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_QUOTA_DATE = new Date("2026-02-05T00:00:00.000Z");

export const QUOTA = Quota.create(
  {
    fundId: FUND_ID,
    date: QUOTA_DATE,
    price: QuotaPrice.create("1000.00"),
  },
  QUOTA_ID,
);

export const OTHER_QUOTA = Quota.create(
  {
    fundId: OTHER_FUND_ID,
    date: FEBRUARY_QUOTA_DATE,
    price: QuotaPrice.create("500.00"),
  },
  OTHER_QUOTA_ID,
);

export const EXTERNAL_QUOTA = Quota.create(
  {
    fundId: FUND_ID,
    date: QUOTA_DUPLICATE_DATE,
    price: QuotaPrice.create("1010.50"),
  },
  EXTERNAL_QUOTA_ID,
);

export const PERIOD_OUTSIDE_QUOTA = Quota.create(
  {
    fundId: FUND_ID,
    date: new Date("2026-03-01T00:00:00.000Z"),
    price: QuotaPrice.create("1020.00"),
  },
  PERIOD_OUTSIDE_QUOTA_ID,
);

export const UPDATED_QUOTA = Quota.create(
  {
    fundId: FUND_ID,
    date: QUOTA_DATE,
    price: QuotaPrice.create("1050.00"),
  },
  QUOTA_ID,
);

export const FRESH_QUOTA = Quota.create({
  fundId: FUND_ID,
  date: new Date("2026-04-05T00:00:00.000Z"),
  price: QuotaPrice.create("1030.00"),
});

function toQuotaRow(entity: Quota): typeof quota.$inferInsert {
  return {
    fundId: entity.fundId,
    date: entity.date,
    price: entity.price.value.toString(),
    createdAt: entity.createdAt,
  };
}

export async function seedQuotas(): Promise<Quota[]> {
  await seedFundById(FUND_ID);
  await seedFundById(OTHER_FUND_ID);

  for (const fixture of [QUOTA, OTHER_QUOTA]) {
    await db.insert(quota).values({ ...toQuotaRow(fixture), id: fixture.id });
  }

  return [QUOTA, OTHER_QUOTA];
}

export async function seedAllQuotas(): Promise<Quota[]> {
  await seedFundById(FUND_ID);
  await seedFundById(OTHER_FUND_ID);

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
