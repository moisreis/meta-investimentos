import { db } from "@/__tests__/__setup__/_database.setup";
import { Fund } from "@/business/entities";
import CNPJ from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { fund } from "@/infrastructure/database/schemas";
import { FundRepository } from "@/infrastructure/repositories";
import { BANK_ID, OTHER_BANK_ID, seedBankById } from "./_bank.seed";
import { BENCHMARK_ID, seedBenchmarkById } from "./_benchmark.seed";
import { CATEGORY_ID, seedCategoryById } from "./_category.seed";

export const FUND_ID = "8c9d0e1f-2a3b-4c4d-9e5f-6a7b8c9d0e1f";
export const OTHER_FUND_ID = "9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a";

export const FUND = Fund.create(
  {
    cnpj: CNPJ.create("12345678000195"),
    name: "Fundo Ações",
    bankId: EntityId.create(BANK_ID),
    benchmarkId: EntityId.create(BENCHMARK_ID),
    categoryId: EntityId.create(CATEGORY_ID),
    administrationFee: SignedPercentage.create("1.5"),
    performanceFee: SignedPercentage.create("20"),
  },
  FUND_ID,
);

export const OTHER_FUND = Fund.create(
  {
    cnpj: CNPJ.create("11222333000181"),
    name: "Fundo Renda Fixa",
    bankId: EntityId.create(OTHER_BANK_ID),
  },
  OTHER_FUND_ID,
);

export const FRESH_FUND = Fund.create({
  cnpj: CNPJ.create("41142260000189"),
  name: "Fundo Multimercado",
  bankId: EntityId.create(BANK_ID),
  benchmarkId: EntityId.create(BENCHMARK_ID),
  categoryId: EntityId.create(CATEGORY_ID),
  administrationFee: SignedPercentage.create("1.2"),
  performanceFee: SignedPercentage.create("15"),
});

export const UPDATED_FUND = Fund.create(
  {
    cnpj: FUND.cnpj,
    name: "Fundo Ações Rebrandeado",
    bankId: FUND.bankId,
    benchmarkId: FUND.benchmarkId,
    categoryId: FUND.categoryId,
    administrationFee: SignedPercentage.create("2.0"),
    performanceFee: FUND.performanceFee,
  },
  FUND_ID,
);

export async function seedFundById(id: string): Promise<Fund> {
  const REPOSITORY = new FundRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
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
