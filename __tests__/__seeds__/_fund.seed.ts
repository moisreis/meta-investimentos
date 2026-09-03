import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Fund } from "@/business/entities/fund/fund.entity";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { fund } from "@/infrastructure/database/schemas";
import { FundRepository } from "@/infrastructure/repositories";
import { seedBankById } from "./_bank.seed";
import { seedBenchmarkById } from "./_benchmark.seed";
import { seedCategoryById } from "./_category.seed";

/**
 * Represents the default fund ID used in tests.
 */
export const FUND_ID = ID.FUND.DEFAULT;

/**
 * Represents an alternative fund ID used in tests.
 */
export const OTHER_FUND_ID = ID.FUND.OTHER;

/**
 * Represents the default fund fixture used in tests.
 *
 * The fixture uses the default bank, benchmark, and category.
 * It has a CNPJ of `12345678000195` and fees of `1.5%` and
 * `20%`.
 */
export const FUND = Fund.create(
  {
    cnpj: CNPJ.create("12345678000195"),
    name: "Fundo Ações",
    bankId: EntityId.create(ID.BANK.DEFAULT),
    benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
    categoryId: EntityId.create(ID.CATEGORY.DEFAULT),
    administrationFee: SignedPercentage.create("1.5"),
    performanceFee: SignedPercentage.create("20"),
  },
  ID.FUND.DEFAULT,
);

/**
 * Represents an alternative fund fixture for tests.
 *
 * The fixture uses the other bank. It has a CNPJ of
 * `11222333000181` and no fees.
 */
export const OTHER_FUND = Fund.create(
  {
    cnpj: CNPJ.create("11222333000181"),
    name: "Fundo Renda Fixa",
    bankId: EntityId.create(ID.BANK.OTHER),
  },
  ID.FUND.OTHER,
);

/**
 * Represents a fund fixture without a predefined ID.
 *
 * The fixture uses the default bank, benchmark, and category.
 * It has a CNPJ of `41142260000189` and fees of `1.2%` and
 * `15%`.
 */
export const FRESH_FUND = Fund.create({
  cnpj: CNPJ.create("41142260000189"),
  name: "Fundo Multimercado",
  bankId: EntityId.create(ID.BANK.DEFAULT),
  benchmarkId: EntityId.create(ID.BENCHMARK.DEFAULT),
  categoryId: EntityId.create(ID.CATEGORY.DEFAULT),
  administrationFee: SignedPercentage.create("1.2"),
  performanceFee: SignedPercentage.create("15"),
});

/**
 * Represents an updated version of the default fund fixture.
 *
 * The fixture reuses the default fund ID but updates the
 * name to "Fundo Ações Rebrandeado" and the administration
 * fee to `2.0%`.
 */
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
  ID.FUND.DEFAULT,
);

/**
 * Seeds a fund into the test database by ID.
 *
 * The function checks if the fund already exists. If it
 * does, the existing record is returned. Otherwise, the
 * required parent entities are seeded and the appropriate
 * fixture is inserted.
 *
 * @param id - The fund ID to seed.
 * @returns A promise that resolves to the seeded
 *          `Fund` fixture.
 */
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

/**
 * Seeds the default funds into the test database.
 *
 * The function calls `seedFundById` for each default fund
 * ID.
 *
 * @returns A promise that resolves to an array containing
 *          the seeded `Fund` fixtures.
 */
export async function seedFunds(): Promise<Fund[]> {
  return [await seedFundById(FUND_ID), await seedFundById(OTHER_FUND_ID)];
}

/**
 * Seeds all parent entities required by fund fixtures.
 *
 * The function inserts the default bank, benchmark, and
 * category records. Call this before inserting funds
 * directly via `db.insert`.
 *
 * @returns A promise that resolves when all parent
 *          entities are seeded.
 */
export async function seedFundFixtureParents(): Promise<void> {
  await seedBankById(ID.BANK.DEFAULT);
  await seedBenchmarkById(ID.BENCHMARK.DEFAULT);
  await seedCategoryById(ID.CATEGORY.DEFAULT);
}
