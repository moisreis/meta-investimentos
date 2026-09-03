import type { Bank } from "@/business/entities/bank/bank.entity";
import type { BankAccount } from "@/business/entities/bank/bank-account.entity";
import type { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a bank.
 */
export interface BankDto {
  id: EntityId;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a bank account.
 */
export interface BankAccountDto {
  id: EntityId;
  portfolioId: EntityId;
  bankId: EntityId;
  agency: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a checking account transaction.
 */
export interface CheckingAccountDto {
  id: EntityId;
  bankAccountId: EntityId;
  date: Date;
  value: string;
}

/**
 * Maps a `Bank` entity to its public DTO representation.
 *
 * @param bank - The bank entity.
 * @returns The bank DTO.
 */
export function toBankDto(bank: Bank): BankDto {
  return {
    id: bank.id as EntityId,
    code: bank.code,
    name: bank.name,
    createdAt: bank.createdAt,
    updatedAt: bank.updatedAt,
  };
}

/**
 * Maps a `BankAccount` entity to its public DTO representation.
 *
 * @param bankAccount - The bank account entity.
 * @returns The bank account DTO.
 */
export function toBankAccountDto(bankAccount: BankAccount): BankAccountDto {
  return {
    id: bankAccount.id as EntityId,
    portfolioId: bankAccount.portfolioId,
    bankId: bankAccount.bankId,
    agency: bankAccount.agency,
    accountNumber: bankAccount.accountNumber,
    createdAt: bankAccount.createdAt,
    updatedAt: bankAccount.updatedAt,
  };
}

/**
 * Maps a `CheckingAccount` entity to its public DTO representation.
 *
 * @param checkingAccount - The checking account entity.
 * @returns The checking account DTO.
 */
export function toCheckingAccountDto(
  checkingAccount: CheckingAccount,
): CheckingAccountDto {
  return {
    id: checkingAccount.id as EntityId,
    bankAccountId: checkingAccount.bankAccountId,
    date: checkingAccount.date,
    value: checkingAccount.value.value.toString(),
  };
}
