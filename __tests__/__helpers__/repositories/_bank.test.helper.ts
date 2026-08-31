import { db } from "@/__tests__/__setup__/_database.setup";
import {
  BankAccountRepository,
  BankRepository,
  CheckingAccountRepository,
} from "@/infrastructure/repositories";

export {
  BANK,
  BANK_ID,
  FRESH_BANK,
  OTHER_BANK,
  OTHER_BANK_ID,
  seedBankById,
  seedBanks,
  UPDATED_BANK,
} from "@/__tests__/__seeds__/_bank.seed";
export {
  BANK_ACCOUNT,
  BANK_ACCOUNT_ID,
  FRESH_BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT_ID,
  seedBankAccounts,
  seedThirdBankAccount,
  THIRD_BANK_ACCOUNT,
  THIRD_BANK_ACCOUNT_ID,
  UPDATED_BANK_ACCOUNT,
} from "@/__tests__/__seeds__/_bank-account.seed";
export {
  CHECKING_ACCOUNT,
  CHECKING_ACCOUNT_ID,
  EXTERNAL_CHECKING_ACCOUNT,
  EXTERNAL_CHECKING_ACCOUNT_ID,
  FEBRUARY_DATE,
  FRESH_CHECKING_ACCOUNT,
  JANUARY_DATE,
  JANUARY_DUPLICATE_DATE,
  OTHER_CHECKING_ACCOUNT,
  OTHER_CHECKING_ACCOUNT_ID,
  PERIOD_OUTSIDE_ACCOUNT,
  PERIOD_OUTSIDE_ACCOUNT_ID,
  seedAllCheckingAccounts,
  seedCheckingAccounts,
  UPDATED_CHECKING_ACCOUNT,
} from "@/__tests__/__seeds__/_checking-account.seed";
export {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
} from "@/__tests__/__seeds__/_portfolio.seed";

export function newBankRepository(): BankRepository {
  return new BankRepository(db);
}

export function newBankAccountRepository(): BankAccountRepository {
  return new BankAccountRepository(db);
}

export function newCheckingAccountRepository(): CheckingAccountRepository {
  return new CheckingAccountRepository(db);
}
