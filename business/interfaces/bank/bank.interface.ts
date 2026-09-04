import type { Bank } from "@/business/entities/bank/bank.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Bank` entities.
 *
 * An `IBank`:
 * - persists banks through {@link IBank.save}.
 * - retrieves banks by id and code.
 * - removes banks by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Bank` entities and back.
 */
export interface IBank {
  /**
   * Retrieves the bank with the provided id.
   *
   * @param id - The unique identifier of the bank.
   * @returns A promise resolving to the `Bank` or `null` when not found.
   */
  findById(id: EntityId): Promise<Bank | null>;

  /**
   * Retrieves the bank with the provided code.
   *
   * @param code - The code of the bank.
   * @returns A promise resolving to the `Bank` or `null` when not found.
   */
  findByCode(code: string): Promise<Bank | null>;

  /**
   * Retrieves all banks, optionally paginated.
   *
   * @param options - The pagination options.
   * @param options.limit - The maximum number of banks to return.
   * @param options.offset - The offset from which to start returning
   * banks.
   * @returns A promise resolving to the collection of `Bank` entities.
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Bank[]>;

  /**
   * Persists the provided bank.
   *
   * When the bank has no id, the implementation inserts a new record
   * and the persisted `Bank` (with its generated id) is returned;
   * otherwise the existing record is updated.
   *
   * @param bank - The bank to persist.
   * @returns A promise resolving to the persisted `Bank`.
   */
  save(bank: Bank): Promise<Bank>;

  /**
   * Removes the bank with the provided id.
   *
   * @param id - The unique identifier of the bank.
   * @returns A promise that resolves when the bank is removed.
   */
  delete(id: EntityId): Promise<void>;
}
