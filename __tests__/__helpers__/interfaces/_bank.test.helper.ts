import { Bank } from "@/business/entities/bank/bank.entity";
import type { IBank } from "@/business/interfaces/bank/bank.interface";

export const BANK_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const BANK = Bank.create(
  { code: "001", name: "Banco do Brasil" },
  BANK_ID,
);

export const UPDATED_BANK = Bank.create(
  { code: "001", name: "Banco do Brasil Ltda" },
  BANK_ID,
);

export function createInMemoryBankRepository(): IBank {
  const ROWS = new Map<string, Bank>();

  return {
    async findById(id: string): Promise<Bank | null> {
      return ROWS.get(id) ?? null;
    },

    async findByCode(code: string): Promise<Bank | null> {
      for (const ROW of ROWS.values()) {
        if (ROW.code === code) return ROW;
      }

      return null;
    },

    async save(bank: Bank): Promise<Bank> {
      ROWS.set(bank.id ?? "generated-id", bank);

      return bank;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
