import {
  EXTERNAL_QUOTA,
  EXTERNAL_QUOTA_ID,
  FEBRUARY_QUOTA_DATE,
  FRESH_QUOTA,
  FUND_ID,
  OTHER_FUND_ID,
  OTHER_QUOTA,
  OTHER_QUOTA_ID,
  PERIOD_OUTSIDE_QUOTA,
  PERIOD_OUTSIDE_QUOTA_ID,
  QUOTA,
  QUOTA_DATE,
  QUOTA_DUPLICATE_DATE,
  QUOTA_ID,
  UPDATED_QUOTA,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Quota } from "@/business/entities";
import { quota } from "@/infrastructure/database/schemas";
import { seedFundById } from "./_fund.seed";

export {
  QUOTA_ID,
  OTHER_QUOTA_ID,
  EXTERNAL_QUOTA_ID,
  PERIOD_OUTSIDE_QUOTA_ID,
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
