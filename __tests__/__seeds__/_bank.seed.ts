import {
  BANK,
  BANK_ID,
  FRESH_BANK,
  OTHER_BANK,
  OTHER_BANK_ID,
  UPDATED_BANK,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Bank } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { bank } from "@/infrastructure/database/schemas";
import { BankRepository } from "@/infrastructure/repositories";

export { BANK_ID, OTHER_BANK_ID, BANK, OTHER_BANK, FRESH_BANK, UPDATED_BANK };

export async function seedBankById(id: string): Promise<Bank> {
  const REPOSITORY = new BankRepository(db);
  const EXISTING = await REPOSITORY.findById(EntityId.create(id));
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
