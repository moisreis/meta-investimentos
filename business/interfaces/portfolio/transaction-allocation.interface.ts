import type { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `TransactionAllocation` entities.
 *
 * An `ITransactionAllocation`:
 * - persists allocations through {@link ITransactionAllocation.save}.
 * - retrieves allocations by id, application id, and withdrawal id.
 * - removes allocations by id.
 *
 * Implementations are responsible for mapping database rows to
 * `TransactionAllocation` entities and back.
 */
export interface ITransactionAllocation {
  /**
   * Retrieves the transaction allocation with the provided id.
   *
   * @param id - The unique identifier of the transaction allocation.
   * @returns A promise resolving to the `TransactionAllocation` or `null`
   * when not found.
   */
  findById(id: EntityId): Promise<TransactionAllocation | null>;

  /**
   * Retrieves all transaction allocations belonging to the provided
   * application id.
   *
   * @param applicationId - The unique identifier of the application.
   * @returns A promise resolving to the `TransactionAllocation` entries or
   * an empty array when there are no matches.
   */
  findAllByApplicationId(
    applicationId: EntityId,
  ): Promise<TransactionAllocation[]>;

  /**
   * Retrieves all transaction allocations belonging to the provided
   * withdrawal id.
   *
   * @param withdrawId - The unique identifier of the withdrawal.
   * @returns A promise resolving to the `TransactionAllocation` entries or
   * an empty array when there are no matches.
   */
  findAllByWithdrawalId(withdrawId: EntityId): Promise<TransactionAllocation[]>;

  /**
   * Persists the provided transaction allocation.
   *
   * When the transaction allocation has no id, the implementation inserts
   * a new record and the persisted `TransactionAllocation` (with its
   * generated id) is returned; otherwise the existing record is updated.
   *
   * @param transactionAllocation - The transaction allocation to persist.
   * @returns A promise resolving to the persisted `TransactionAllocation`.
   */
  save(
    transactionAllocation: TransactionAllocation,
  ): Promise<TransactionAllocation>;

  /**
   * Removes the transaction allocation with the provided id.
   *
   * @param id - The unique identifier of the transaction allocation.
   * @returns A promise that resolves when the transaction allocation is
   * removed.
   */
  delete(id: EntityId): Promise<void>;
}
