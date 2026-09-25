import type { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import type { EntityId } from "@/value-objects"

// Count of bank account rows linked to a portfolio.
export interface PortfolioRowCount {
  // The unique identifier of the portfolio.
  portfolioId: EntityId

  // The number of linked bank account rows.
  count: number
}

/**
 * @summary
 * Defines the repository contract for `BankAccount` entities.
 *
 * @remarks
 * An `IBankAccount` persists, retrieves, and
 * removes bank accounts.
 * Supports lookup by id, portfolio id, and bank id.
 *
 * @explanation
 * Use this interface to implement data access for bank accounts.
 * Persistence implementations map rows to
 * `BankAccount` entities.
 *
 * @example
 * const BA = await BANK_ACCOUNT_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IBankAccount {
  /**
   * @summary
   * Retrieves the bank account with the provided id.
   *
   * @remarks
   * Returns null when no bank account matches.
   *
   * @explanation
   * Use this method to look up a single bank account by
   * its unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the bank account.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const BA = await BANK_ACCOUNT_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<BankAccount | null>

  /**
   * @summary
   * Retrieves all bank accounts of the provided portfolio.
   *
   * @remarks
   * Returns an empty array when no bank accounts match.
   *
   * @explanation
   * Use this method to list bank accounts linked to a
   * portfolio. Returns an empty array for no matches.
   *
   * @param portfolioId - The id of the portfolio.
   *
   * @returns The matching entries.
   *
   * @example
   * const BAS = await BANK_ACCOUNT_REPO
   *   .findAllByPortfolioId(PORTFOLIO_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPortfolioId(
    portfolioId: EntityId
  ): Promise<BankAccount[]>

  /**
   * @summary
   * Retrieves all bank accounts of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when no bank accounts match.
   *
   * @explanation
   * Use this method to list bank accounts linked to
   * multiple portfolios. Returns an empty array for
   * no matches.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The matching entries.
   *
   * @example
   * const BAS = await BANK_ACCOUNT_REPO
   *   .findAllByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<BankAccount[]>

  /**
   * @summary
   * Counts the bank account rows linked per provided portfolio.
   *
   * @remarks
   * Returns an entry per matched portfolio and an empty
   * array when the input is empty.
   *
   * @explanation
   * Use this method to tally bank accounts through a single
   * grouped query instead of hydrating every row.
   *
   * @param portfolioIds - The ids of the portfolios.
   *
   * @returns The bank account count per portfolio.
   *
   * @example
   * const COUNTS = await BANK_ACCOUNT_REPO
   *   .countByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  countByPortfolioIds(
    portfolioIds: EntityId[]
  ): Promise<PortfolioRowCount[]>

  /**
   * @summary
   * Retrieves all bank accounts of the provided bank.
   *
   * @remarks
   * Returns an empty array when no bank accounts match.
   *
   * @explanation
   * Use this method to list bank accounts linked to a
   * bank. Returns an empty array for no matches.
   *
   * @param bankId - The id of the bank.
   *
   * @returns The matching entries.
   *
   * @example
   * const BAS = await BANK_ACCOUNT_REPO
   *   .findAllByBankId(BANK_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByBankId(bankId: EntityId): Promise<BankAccount[]>

  /**
   * @summary
   * Retrieves all bank accounts of the provided banks.
   *
   * @remarks
   * Returns an empty array when no bank accounts match.
   *
   * @explanation
   * Use this method to list bank accounts linked to
   * multiple banks. Returns an empty array for no matches.
   *
   * @param bankIds - The ids of the banks.
   *
   * @returns The matching entries.
   *
   * @example
   * const BAS = await BANK_ACCOUNT_REPO
   *   .findAllByBankIds(BANK_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByBankIds(bankIds: EntityId[]): Promise<BankAccount[]>

  /**
   * @summary
   * Persists the provided bank account.
   *
   * @remarks
   * Inserts a new record when the bank account has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a bank account.
   * The persisted entity with its id is returned.
   *
   * @param bankAccount - The bank account to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const BA = await BANK_ACCOUNT_REPO.save(NEW_BA);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(bankAccount: BankAccount): Promise<BankAccount>

  /**
   * @summary
   * Removes the bank account with the provided id.
   *
   * @remarks
   * Resolves when the bank account is removed.
   *
   * @explanation
   * Use this method to delete a bank account record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the bank account.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await BANK_ACCOUNT_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
