import type { CheckingAccount } from "@/business/entities/bank/checking-account.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `CheckingAccount` entities.
 *
 * An `ICheckingAccount`:
 * - persists checking accounts through {@link ICheckingAccount.save}.
 * - retrieves checking accounts by id, bank account id, and date.
 * - removes checking accounts by id.
 *
 * Implementations are responsible for mapping database rows to
 * `CheckingAccount` entities and back.
 */
export interface ICheckingAccount {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the checking account with the provided id.
   *
   * @param id - The unique identifier of the checking account.
   * @returns A promise resolving to the `CheckingAccount` or `null`
   *   when not found.
   */
  findById(id: string): Promise<CheckingAccount | null>;

  /**
   * Retrieves all checking accounts of the provided bank account.
   *
   * @param bankAccountId - The id of the bank account.
   * @returns A promise resolving to the `CheckingAccount` array of the
   *   bank account.
   */
  findAllByBankAccountId(bankAccountId: string): Promise<CheckingAccount[]>;

  /**
   * Retrieves the checking account of the provided bank account on the
   * provided date.
   *
   * @param bankAccountId - The id of the bank account.
   * @param date - The date of the checking account transaction.
   * @returns A promise resolving to the `CheckingAccount` or `null`
   *   when not found.
   */
  findByBankAccountIdAndDate(
    bankAccountId: string,
    date: Date,
  ): Promise<CheckingAccount | null>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided checking account.
   *
   * When the checking account has no id, the implementation inserts a
   * new record and the persisted `CheckingAccount` (with its generated
   * id) is returned; otherwise the existing record is updated.
   *
   * @param checkingAccount - The checking account to persist.
   * @returns A promise resolving to the persisted `CheckingAccount`.
   */
  save(checkingAccount: CheckingAccount): Promise<CheckingAccount>;

  /**
   * Removes the checking account with the provided id.
   *
   * @param id - The unique identifier of the checking account.
   * @returns A promise that resolves when the checking account is
   *   removed.
   */
  delete(id: string): Promise<void>;
}
