import { db } from "@/__tests__/__setup__/_database.setup";
import { Bank } from "@/business/entities";
import { bank } from "@/infrastructure/database/schemas";
import { BankRepository } from "@/infrastructure/repositories";

export const BANK_ID = "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f";
export const OTHER_BANK_ID = "3d4e5f6a-7b8c-4d9e-8f0a-1b2c3d4e5f6a";

export const BANK = Bank.create(
  { code: "001", name: "Banco do Brasil" },
  BANK_ID,
);

export const OTHER_BANK = Bank.create(
  { code: "002", name: "Itaú Unibanco" },
  OTHER_BANK_ID,
);

export const FRESH_BANK = Bank.create({ code: "003", name: "Bradesco" });

export const UPDATED_BANK = Bank.create(
  { code: BANK.code, name: "Banco do Brasil S.A." },
  BANK_ID,
);

export async function seedBankById(id: string): Promise<Bank> {
  const REPOSITORY = new BankRepository(db);
  const EXISTING = await REPOSITORY.findById(id);
  if (EXISTING) return EXISTING;

  const FIXTURE = id === BANK_ID ? BANK : OTHER_BANK;

  await db.insert(bank).values({
    id: FIXTURE.id,
    code: FIXTURE.code,
    name: FIXTURE.name,
    createdAt: FIXTURE.createdAt,
    updatedAt: FIXTURE.updatedAt,
  });

  return FIXTURE;
}

export async function seedBanks(): Promise<Bank[]> {
  return [await seedBankById(BANK_ID), await seedBankById(OTHER_BANK_ID)];
}
