import { BankAccount } from "@/business/entities/bank/bank-account.entity";
import type { IBankAccount } from "@/business/interfaces/bank/bank-account.interface";

export const BANK_ACCOUNT_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const PROPS = {
  portfolioId: "p1",
  bankId: "b1",
  agency: "1234",
  accountNumber: "56789-0",
};

export const BANK_ACCOUNT = BankAccount.create(PROPS, BANK_ACCOUNT_ID);

export const UPDATED_BANK_ACCOUNT = BankAccount.create(
  { ...PROPS, accountNumber: "56789-1" },
  BANK_ACCOUNT_ID,
);

export function createInMemoryBankAccountRepository(): IBankAccount {
  const ROWS = new Map<string, BankAccount>();

  return {
    async findById(id: string): Promise<BankAccount | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByPortfolioId(portfolioId: string): Promise<BankAccount[]> {
      const FOUND: BankAccount[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.portfolioId === portfolioId) FOUND.push(ROW);
      }

      return FOUND;
    },

    async findAllByBankId(bankId: string): Promise<BankAccount[]> {
      const FOUND: BankAccount[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.bankId === bankId) FOUND.push(ROW);
      }

      return FOUND;
    },

    async save(bankAccount: BankAccount): Promise<BankAccount> {
      ROWS.set(bankAccount.id ?? "generated-id", bankAccount);

      return bankAccount;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
