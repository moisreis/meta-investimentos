import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { Bank } from "@/business/entities/bank/bank.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { bank } from "@/infrastructure/database/schemas";
import { BankRepository } from "@/infrastructure/repositories";

/**
 * Represents the default bank fixture for tests.
 *
 * Creates a `Bank` with code `001` and name
 * `Banco do Brasil`.
 */
export const BANK = Bank.create(
  { code: "001", name: "Banco do Brasil" },
  ID.BANK.DEFAULT,
);

/**
 * Represents a secondary bank fixture for tests.
 *
 * Creates a `Bank` with code `002` and name
 * `Itaú Unibanco`.
 */
export const OTHER_BANK = Bank.create(
  { code: "002", name: "Itaú Unibanco" },
  ID.BANK.OTHER,
);

/**
 * Represents a fresh bank fixture without a fixed ID.
 *
 * Creates a `Bank` with code `003` and name `Bradesco`.
 * The entity generates a new ID when created.
 */
export const FRESH_BANK = Bank.create({ code: "003", name: "Bradesco" });

/**
 * Represents the default bank identifier for tests.
 */
export const BANK_ID = ID.BANK.DEFAULT;

/**
 * Represents the other bank identifier for tests.
 */
export const OTHER_BANK_ID = ID.BANK.OTHER;

/**
 * Represents an updated version of the default bank fixture.
 *
 * Creates a `Bank` with the same ID as `BANK` but with the
 * name `Banco do Brasil S.A.`.
 */
export const UPDATED_BANK = Bank.create(
  { code: BANK.code, name: "Banco do Brasil S.A." },
  ID.BANK.DEFAULT,
);

/**
 * Seeds a bank row into the database by its ID.
 *
 * Looks up the bank in the database first. Returns the
 * existing row when found. Inserts the corresponding
 * fixture when the row does not exist.
 *
 * @param id - The bank ID to seed.
 * @returns The existing or newly seeded `Bank` instance.
 */
export async function seedBankById(id: string): Promise<Bank> {
  const REPOSITORY = new BankRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
  if (EXISTING) return EXISTING;

  const FIXTURE = id === ID.BANK.DEFAULT ? BANK : OTHER_BANK;

  await db.insert(bank).values({
    id: FIXTURE.id,
    code: FIXTURE.code,
    name: FIXTURE.name,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

/**
 * Seeds the default and other bank fixtures into the database.
 *
 * Calls {@link seedBankById} for each default bank ID.
 *
 * @returns An array containing the seeded `BANK` and
 *          `OTHER_BANK` instances.
 */
export async function seedBanks(): Promise<Bank[]> {
  return [
    await seedBankById(ID.BANK.DEFAULT),
    await seedBankById(ID.BANK.OTHER),
  ];
}
