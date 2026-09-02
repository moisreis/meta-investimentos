import { db } from "@/__tests__/__setup__/_database.setup";
import {
  CategoryRepository,
  FundRepository,
  QuotaRepository,
} from "@/infrastructure/repositories";

export { BANK_ID, OTHER_BANK_ID } from "@/__tests__/__seeds__/_bank.seed";
export { BENCHMARK_ID } from "@/__tests__/__seeds__/_benchmark.seed";
export {
  CATEGORY,
  CATEGORY_ID,
  FRESH_CATEGORY,
  OTHER_CATEGORY,
  OTHER_CATEGORY_ID,
  seedCategories,
  seedCategoryById,
  UPDATED_CATEGORY,
} from "@/__tests__/__seeds__/_category.seed";
export {
  FRESH_FUND,
  FUND,
  FUND_ID,
  OTHER_FUND,
  OTHER_FUND_ID,
  seedFundById,
  seedFundFixtureParents,
  seedFunds,
  UPDATED_FUND,
} from "@/__tests__/__seeds__/_fund.seed";
export {
  EXTERNAL_QUOTA,
  EXTERNAL_QUOTA_ID,
  FEBRUARY_QUOTA_DATE,
  FRESH_QUOTA,
  OTHER_QUOTA,
  OTHER_QUOTA_ID,
  PERIOD_OUTSIDE_QUOTA,
  PERIOD_OUTSIDE_QUOTA_ID,
  QUOTA,
  QUOTA_DATE,
  QUOTA_DUPLICATE_DATE,
  QUOTA_ID,
  seedAllQuotas,
  seedQuotas,
  UPDATED_QUOTA,
} from "@/__tests__/__seeds__/_quota.seed";

export function newCategoryRepository(): CategoryRepository {
  return new CategoryRepository(db);
}

export function newFundRepository(): FundRepository {
  return new FundRepository(db);
}

export function newQuotaRepository(): QuotaRepository {
  return new QuotaRepository(db);
}
