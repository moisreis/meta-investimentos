import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Bank } from "@/business/entities/bank/bank.entity";
import type { IBank } from "@/business/interfaces/bank/bank.interface";

/**
 * Represents the default bank fixture for tests.
 *
 * The fixture has the code `001` and the name
 * "Banco do Brasil".
 */
export const BANK = Bank.create(
  { code: "001", name: "Banco do Brasil" },
  ID.BANK.DEFAULT,
);

/**
 * Represents an alternative bank fixture for tests.
 *
 * The fixture has the code `002` and the name
 * "Itaú Unibanco".
 */
export const OTHER_BANK = Bank.create(
  { code: "002", name: "Itaú Unibanco" },
  ID.BANK.OTHER,
);

/**
 * Represents a bank fixture without a predefined ID.
 *
 * The fixture has the code `003` and the name "Bradesco".
 * The code generates the ID at creation.
 */
export const FRESH_BANK = Bank.create({ code: "003", name: "Bradesco" });

/**
 * Represents an updated version of the default bank fixture.
 *
 * The fixture keeps the same code as the default bank. The
 * name changes to "Banco do Brasil S.A.".
 */
export const UPDATED_BANK = Bank.create(
  { code: BANK.code, name: "Banco do Brasil S.A." },
  ID.BANK.DEFAULT,
);

/**
 * Represents the default bank identifier for tests.
 */
export const BANK_ID = ID.BANK.DEFAULT;

/**
 * Creates an in-memory implementation of the {@link IBank}
 * repository interface.
 *
 * The repository stores {@link Bank} instances in memory
 * and supports lookup by ID and by code. Use this factory
 * in unit tests that need a persistent but isolated bank
 * store.
 *
 * @returns A fresh {@link IBank} instance backed by memory.
 */
export function createInMemoryBankRepository(): IBank {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IBank["save"]>>>({
    extractId: (b) => b.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByCode(code) {
      return BASE.findOne((b) => b.code === code);
    },
    findAll: () => BASE.findAll(),
    save: (bank) => BASE.save(bank),
    delete: (id) => BASE.delete(id),
  };
}
