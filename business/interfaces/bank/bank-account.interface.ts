import type { BankAccount } from "@/business/entities/bank/bank-account.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `BankAccount` entities.
 *
 * An `IBankAccount`:
 * - persists bank accounts through {@link IBankAccount.save}.
 * - retrieves bank accounts by id, portfolio id, and bank id.
 * - removes bank accounts by id.
 *
 * Implementations are responsible for mapping database rows to
 * `BankAccount` entities and back.
 */
export interface IBankAccount {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the bank account with the provided id.
   *
   * @param id - The unique identifier of the bank account.
   * @returns A promise resolving to the `BankAccount` or `null` when
   *   not found.
   */
  findById(id: string): Promise<BankAccount | null>;

  /**
   * Retrieves all bank accounts of the provided portfolio.
   *
   * @param portfolioId - The id of the portfolio.
   * @returns A promise resolving to the `BankAccount` array of the
   *   portfolio.
   */
  findAllByPortfolioId(portfolioId: string): Promise<BankAccount[]>;

  /**
   * Retrieves all bank accounts of the provided bank.
   *
   * @param bankId - The id of the bank.
   * @returns A promise resolving to the `BankAccount` array of the
   *   bank.
   */
  findAllByBankId(bankId: string): Promise<BankAccount[]>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided bank account.
   *
   * When the bank account has no id, the implementation inserts a new
   * record and the persisted `BankAccount` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param bankAccount - The bank account to persist.
   * @returns A promise resolving to the persisted `BankAccount`.
   */
  save(bankAccount: BankAccount): Promise<BankAccount>;

  /**
   * Removes the bank account with the provided id.
   *
   * @param id - The unique identifier of the bank account.
   * @returns A promise that resolves when the bank account is removed.
   */
  delete(id: string): Promise<void>;
}
