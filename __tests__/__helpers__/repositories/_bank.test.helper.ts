import { db } from "@/__tests__/__setup__/_database.setup";
import {
  BankAccountRepository,
  BankRepository,
  CheckingAccountRepository,
} from "@/infrastructure/repositories";

/**
 * Re-exports the bank seed fixtures and functions
 * used by bank repository tests.
 */
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

/**
 * Re-exports the bank account seed fixtures and functions
 * used by bank account repository tests.
 */
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

/**
 * Re-exports the checking account seed fixtures and
 * functions used by checking account repository tests.
 */
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

/**
 * Re-exports the portfolio ID constants required by
 * checking account seed setup.
 */
export {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
} from "@/__tests__/__seeds__/_portfolio.seed";

/**
 * Creates a new `BankRepository` bound to the shared
 * test database.
 *
 * @returns A new `BankRepository` instance.
 */
export function newBankRepository(): BankRepository {
  return new BankRepository(db);
}

/**
 * Creates a new `BankAccountRepository` bound to the
 * shared test database.
 *
 * @returns A new `BankAccountRepository` instance.
 */
export function newBankAccountRepository(): BankAccountRepository {
  return new BankAccountRepository(db);
}

/**
 * Creates a new `CheckingAccountRepository` bound to
 * the shared test database.
 *
 * @returns A new `CheckingAccountRepository` instance.
 */
export function newCheckingAccountRepository(): CheckingAccountRepository {
  return new CheckingAccountRepository(db);
}
