import {
  BANK_ID,
  BENCHMARK_ID,
  CATEGORY_ID,
  FRESH_FUND,
  FUND,
  FUND_ID,
  OTHER_FUND,
  OTHER_FUND_ID,
  UPDATED_FUND,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Fund } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { fund } from "@/infrastructure/database/schemas";
import { FundRepository } from "@/infrastructure/repositories";
import { seedBankById } from "./_bank.seed";
import { seedBenchmarkById } from "./_benchmark.seed";
import { seedCategoryById } from "./_category.seed";

export { FUND_ID, OTHER_FUND_ID, FUND, OTHER_FUND, FRESH_FUND, UPDATED_FUND };

export async function seedFundById(id: string): Promise<Fund> {
  const REPOSITORY = new FundRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE = id === FUND_ID ? FUND : OTHER_FUND;

  await seedBankById(FIXTURE.bankId);
  if (FIXTURE.benchmarkId) await seedBenchmarkById(FIXTURE.benchmarkId);
  if (FIXTURE.categoryId) await seedCategoryById(FIXTURE.categoryId);

  await db.insert(fund).values({
    id: FIXTURE.id,
    cnpj: FIXTURE.cnpj.value,
    name: FIXTURE.name,
    administrationFee: FIXTURE.administrationFee?.value.toString() ?? null,
    performanceFee: FIXTURE.performanceFee?.value.toString() ?? null,
    bankId: FIXTURE.bankId,
    benchmarkId: FIXTURE.benchmarkId,
    categoryId: FIXTURE.categoryId,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

export async function seedFunds(): Promise<Fund[]> {
  return [await seedFundById(FUND_ID), await seedFundById(OTHER_FUND_ID)];
}

export async function seedFundFixtureParents(): Promise<void> {
  await seedBankById(BANK_ID);
  await seedBenchmarkById(BENCHMARK_ID);
  await seedCategoryById(CATEGORY_ID);
}
