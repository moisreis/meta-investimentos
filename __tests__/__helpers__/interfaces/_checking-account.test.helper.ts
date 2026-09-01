import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import type { ICheckingAccount } from "@/business/interfaces/bank/checking-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";

export const CHECKING_ACCOUNT_ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

export const PROPS = {
  bankAccountId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
  date: new Date("2026-01-01T00:00:00.000Z"),
  value: SignedMoney.create("-123.45"),
};

export const CHECKING_ACCOUNT = CheckingAccount.create(
  PROPS,
  CHECKING_ACCOUNT_ID,
);

export const UPDATED_CHECKING_ACCOUNT = CheckingAccount.create(
  { ...PROPS, value: SignedMoney.create("99.99") },
  CHECKING_ACCOUNT_ID,
);

export function createInMemoryCheckingAccountRepository(): ICheckingAccount {
  const ROWS = new Map<string, CheckingAccount>();

  return {
    async findById(id: string): Promise<CheckingAccount | null> {
      return ROWS.get(id) ?? null;
    },

    async findAllByBankAccountId(
      bankAccountId: string,
    ): Promise<CheckingAccount[]> {
      const FOUND: CheckingAccount[] = [];

      for (const ROW of ROWS.values()) {
        if (ROW.bankAccountId === bankAccountId) FOUND.push(ROW);
      }

      return FOUND;
    },

    async findByBankAccountIdAndDate(
      bankAccountId: string,
      date: Date,
    ): Promise<CheckingAccount | null> {
      for (const ROW of ROWS.values()) {
        if (
          ROW.bankAccountId === bankAccountId &&
          ROW.date.getTime() === date.getTime()
        ) {
          return ROW;
        }
      }

      return null;
    },

    async save(checkingAccount: CheckingAccount): Promise<CheckingAccount> {
      ROWS.set(checkingAccount.id ?? "generated-id", checkingAccount);

      return checkingAccount;
    },

    async delete(id: string): Promise<void> {
      ROWS.delete(id);
    },
  };
}
