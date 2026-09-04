import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Fund } from "@/business/entities/fund/fund.entity";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

/**
 * Represents the default fund identifier for tests.
 */
export const FUND_ID = ID.FUND.DEFAULT;

/**
 * Represents the secondary fund identifier for tests.
 */
export const OTHER_FUND_ID = ID.FUND.OTHER;

/**
 * Represents a default fund entity with administration and
 * performance fees configured.
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
 * Represents a secondary fund entity with minimal data.
 * No benchmark or category is assigned.
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
 * Represents a fund entity without a predefined
 * identifier. Use this fixture to test insert operations.
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
 * Represents a fund entity with a modified administration
 * fee. Reuses the default fund identifier.
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
 * Creates an in-memory repository that implements
 * {@link IFund}.
 *
 * The repository stores {@link Fund} entities in memory
 * and supports find, save, and delete operations.
 *
 * @returns A new in-memory `IFund` repository instance.
 */
export function createInMemoryFundRepository(): IFund {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IFund["save"]>>>({
    extractId: (f) => f.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByCnpj(cnpj) {
      return BASE.findOne((f) => f.cnpj.value === cnpj);
    },
    findAll: () => BASE.findAll(),
    save: (fund) => BASE.save(fund),
    delete: (id) => BASE.delete(id),
  };
}
