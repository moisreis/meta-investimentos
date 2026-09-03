import { db } from "@/__tests__/__setup__/_database.setup";
import {
  CategoryRepository,
  FundRepository,
  QuotaRepository,
} from "@/infrastructure/repositories";

/**
 * Re-exports the bank ID constants required by fund
 * and category seed setup.
 */
export { BANK_ID, OTHER_BANK_ID } from "@/__tests__/__seeds__/_bank.seed";

/**
 * Re-exports the benchmark ID constant required by
 * fund seed setup.
 */
export { BENCHMARK_ID } from "@/__tests__/__seeds__/_benchmark.seed";

/**
 * Re-exports the category seed fixtures and functions
 * used by category repository tests.
 */
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

/**
 * Re-exports the fund seed fixtures and functions used
 * by fund repository tests.
 */
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

/**
 * Re-exports the quota seed fixtures and functions used
 * by quota repository tests.
 */
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

/**
 * Creates a new `CategoryRepository` bound to the
 * shared test database.
 *
 * @returns A new `CategoryRepository` instance.
 */
export function newCategoryRepository(): CategoryRepository {
  return new CategoryRepository(db);
}

/**
 * Creates a new `FundRepository` bound to the shared
 * test database.
 *
 * @returns A new `FundRepository` instance.
 */
export function newFundRepository(): FundRepository {
  return new FundRepository(db);
}

/**
 * Creates a new `QuotaRepository` bound to the shared
 * test database.
 *
 * @returns A new `QuotaRepository` instance.
 */
export function newQuotaRepository(): QuotaRepository {
  return new QuotaRepository(db);
}
