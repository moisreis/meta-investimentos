import type { Bank } from "@domain/bank/entities/bank.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Bank` entities.
 *
 * @remarks
 * An `IBank` persists, retrieves, and removes banks.
 * Supports lookup by id and code.
 *
 * @explanation
 * Use this interface to implement data access for banks.
 * Persistence implementations map rows to `Bank` entities.
 *
 * @example
 * const BANK = await BANK_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IBank {
  /**
   * @summary
   * Retrieves the bank with the provided id.
   *
   * @remarks
   * Returns null when no bank matches.
   *
   * @explanation
   * Use this method to look up a single bank by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the bank.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const BANK = await BANK_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Bank | null>

  /**
   * @summary
   * Retrieves the bank with the provided code.
   *
   * @remarks
   * Returns null when no bank matches.
   *
   * @explanation
   * Use this method to look up a bank by its
   * external code. Callers check null for existence.
   *
   * @param code - The code of the bank.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const BANK = await BANK_REPO.findByCode(CODE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByCode(code: string): Promise<Bank | null>

  /**
   * @summary
   * Retrieves all banks, optionally paginated.
   *
   * @remarks
   * Use limit and offset to paginate results.
   *
   * @explanation
   * Use this method to list all banks. Pass options
   * to paginate when the dataset is large.
   *
   * @param options - The pagination options.
   * @param options.limit - Maximum banks to return.
   * @param options.offset - Starting offset.
   *
   * @returns The matching entries.
   *
   * @example
   * const BANKS = await BANK_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<Bank[]>

  /**
   * @summary
   * Retrieves all banks with the provided ids.
   *
   * @remarks
   * Returns an empty array when no banks match.
   *
   * @explanation
   * Use this method to fetch multiple banks by their
   * unique identifiers. Returns an empty array for
   * no matches.
   *
   * @param ids - The unique identifiers of the banks.
   *
   * @returns The matching entries.
   *
   * @example
   * const BANKS = await BANK_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIds(ids: EntityId[]): Promise<Bank[]>

  /**
   * @summary
   * Persists the provided bank.
   *
   * @remarks
   * Inserts a new record when the bank has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a bank record.
   * The persisted entity with its id is returned.
   *
   * @param bank - The bank to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const BANK = await BANK_REPO.save(NEW_BANK);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(bank: Bank): Promise<Bank>

  /**
   * @summary
   * Removes the bank with the provided id.
   *
   * @remarks
   * Resolves when the bank is removed.
   *
   * @explanation
   * Use this method to delete a bank record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the bank.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await BANK_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>

  /**
   * @summary
   * Removes the banks with the provided ids.
   *
   * @remarks
   * Resolves when the banks are removed. A no-op for an
   * empty id list.
   *
   * @explanation
   * Use this method to delete many banks in a single
   * operation instead of one query per id.
   *
   * @param ids - The unique identifiers of the banks.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await BANK_REPO.deleteByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  deleteByIds(ids: EntityId[]): Promise<void>
}
