import {
  BANK_ACCOUNT_ID,
  CHECKING_ACCOUNT,
  CHECKING_ACCOUNT_ID,
  EXTERNAL_CHECKING_ACCOUNT,
  EXTERNAL_CHECKING_ACCOUNT_ID,
  FEBRUARY_DATE,
  FRESH_CHECKING_ACCOUNT,
  JANUARY_DATE,
  OTHER_CHECKING_ACCOUNT,
  OTHER_CHECKING_ACCOUNT_ID,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT_ID,
  UPDATED_CHECKING_ACCOUNT,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { ICheckingAccount } from "@/business/interfaces/bank/checking-account.interface";

import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

export {
  BANK_ACCOUNT_ID,
  CHECKING_ACCOUNT_ID,
  OTHER_CHECKING_ACCOUNT_ID,
  EXTERNAL_CHECKING_ACCOUNT_ID,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT_ID,
  JANUARY_DATE,
  FEBRUARY_DATE,
  CHECKING_ACCOUNT,
  OTHER_CHECKING_ACCOUNT,
  EXTERNAL_CHECKING_ACCOUNT,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT,
  UPDATED_CHECKING_ACCOUNT,
  FRESH_CHECKING_ACCOUNT,
};

export const PROPS = {
  bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
  date: new Date("2026-01-05T00:00:00.000Z"),
  value: SignedMoney.create("-123.45"),
};

export function createInMemoryCheckingAccountRepository(): ICheckingAccount {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<ICheckingAccount["save"]>>
  >({ extractId: (ca) => ca.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByBankAccountId(bankAccountId) {
      return BASE.match((ca) => ca.bankAccountId === bankAccountId);
    },
    async findByBankAccountIdAndDate(bankAccountId, date) {
      return BASE.findOne(
        (ca) =>
          ca.bankAccountId === bankAccountId &&
          ca.date.getTime() === date.getTime(),
      );
    },
    save: (checkingAccount) => BASE.save(checkingAccount),
    delete: (id) => BASE.delete(id),
  };
}
