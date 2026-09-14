import type { TransactionAllocation } from "@domain/transaction-allocation/entities/transaction-allocation.entity";
import type { EntityId } from "@/value-objects";

/**
 * @summary
 * Defines the repository contract for `TransactionAllocation`
 * entities.
 *
 * @remarks
 * An `ITransactionAllocation` persists, retrieves, and removes
 * allocations. Supports lookup by id, application id, and
 * withdrawal id.
 *
 * @explanation
 * Use this interface to implement data access for allocations.
 * Persistence implementations map rows to `TransactionAllocation`
 * entities.
 *
 * @example
 * const TA = await ALLOC_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface ITransactionAllocation {
  /**
   * @summary
   * Retrieves the allocation with the provided id.
   *
   * @remarks
   * Returns null when no allocation matches.
   *
   * @explanation
   * Use this method to look up a single allocation by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the allocation.
   * @returns The entry or `null`.
   *
   * @example
   * const TA = await ALLOC_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<TransactionAllocation | null>;

  /**
   * @summary
   * Retrieves all allocations of the provided application.
   *
   * @remarks
   * Returns an empty array when no allocations match.
   *
   * @explanation
   * Use this method to list allocations linked to an
   * application. Returns an empty array for no matches.
   *
   * @param applicationId - The unique identifier of the application.
   * @returns The matching entries.
   *
   * @example
   * const TAS = await ALLOC_REPO
   *   .findAllByApplicationId(APP_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByApplicationId(
    applicationId: EntityId,
  ): Promise<TransactionAllocation[]>;

  /**
   * @summary
   * Retrieves all allocations of the provided withdrawal.
   *
   * @remarks
   * Returns an empty array when no allocations match.
   *
   * @explanation
   * Use this method to list allocations linked to a
   * withdrawal. Returns an empty array for no matches.
   *
   * @param withdrawId - The unique identifier of the withdrawal.
   * @returns The matching entries.
   *
   * @example
   * const TAS = await ALLOC_REPO
   *   .findAllByWithdrawalId(WD_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByWithdrawalId(withdrawId: EntityId): Promise<TransactionAllocation[]>;

  /**
   * @summary
   * Persists the provided allocation.
   *
   * @remarks
   * Inserts a new record when the allocation has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update an allocation.
   * The persisted entity with its id is returned.
   *
   * @param transactionAllocation - The allocation to persist.
   * @returns The persisted entry.
   *
   * @example
   * const TA = await ALLOC_REPO.save(NEW_TA);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(
    transactionAllocation: TransactionAllocation,
  ): Promise<TransactionAllocation>;

  /**
   * @summary
   * Removes the allocation with the provided id.
   *
   * @remarks
   * Resolves when the allocation is removed.
   *
   * @explanation
   * Use this method to delete an allocation record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the allocation.
   * @returns Resolves when removed.
   *
   * @example
   * await ALLOC_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>;
}