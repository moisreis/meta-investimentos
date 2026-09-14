import type { CheckingAccount } from "@domain/checking-account/entities/checking-account.entity";
import type { EntityId } from "@/value-objects";

/**
 * @summary
 * Defines the repository contract for `CheckingAccount` entities.
 *
 * @remarks
 * An `ICheckingAccount` persists, retrieves, and removes
 * checking accounts. Supports lookup by id, bank account
 * id, and date.
 *
 * @explanation
 * Use this interface to implement data access for checking
 * accounts. Persistence implementations map rows to
 * `CheckingAccount` entities.
 *
 * @example
 * const CA = await CHECKING_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface ICheckingAccount {
  /**
   * @summary
   * Retrieves the checking account with the provided id.
   *
   * @remarks
   * Returns null when no checking account matches.
   *
   * @explanation
   * Use this method to look up a single checking account
   * by its unique identifier. Callers check null.
   *
   * @param id - The unique identifier of the checking account.
   * @returns The entry or `null`.
   *
   * @example
   * const CA = await CHECKING_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<CheckingAccount | null>;

  /**
   * @summary
   * Retrieves all checking accounts of the bank account.
   *
   * @remarks
   * Returns an empty array when no checking accounts match.
   *
   * @explanation
   * Use this method to list checking accounts linked to a
   * bank account. Returns an empty array for no matches.
   *
   * @param bankAccountId - The id of the bank account.
   * @returns The matching entries.
   *
   * @example
   * const CAS = await CHECKING_REPO
   *   .findAllByBankAccountId(BA_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByBankAccountId(bankAccountId: EntityId): Promise<CheckingAccount[]>;

  /**
   * @summary
   * Retrieves the checking account of the bank account on
   * the provided date.
   *
   * @remarks
   * Returns null when no checking account matches.
   *
   * @explanation
   * Use this method to find the daily checking account of
   * a bank account. Callers check null for existence.
   *
   * @param bankAccountId - The id of the bank account.
   * @param date - The date of the checking account.
   * @returns The entry or `null`.
   *
   * @example
   * const CA = await CHECKING_REPO
   *   .findByBankAccountIdAndDate(BA_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByBankAccountIdAndDate(
    bankAccountId: EntityId,
    date: Date,
  ): Promise<CheckingAccount | null>;

  /**
   * @summary
   * Persists the provided checking account.
   *
   * @remarks
   * Inserts a new record when the checking account has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a checking account.
   * The persisted entity with its id is returned.
   *
   * @param checkingAccount - The checking account to persist.
   * @returns The persisted entry.
   *
   * @example
   * const CA = await CHECKING_REPO.save(NEW_CA);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(checkingAccount: CheckingAccount): Promise<CheckingAccount>;

  /**
   * @summary
   * Removes the checking account with the provided id.
   *
   * @remarks
   * Resolves when the checking account is removed.
   *
   * @explanation
   * Use this method to delete a checking account record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the checking account.
   * @returns Resolves when removed.
   *
   * @example
   * await CHECKING_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}