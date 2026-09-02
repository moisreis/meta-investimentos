import type { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Withdrawal` entities.
 *
 * An `IWithdrawal`:
 * - persists withdrawals through {@link IWithdrawal.save}.
 * - retrieves withdrawals by id, position id, and date period.
 * - removes withdrawals by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Withdrawal` entities and back.
 */
export interface IWithdrawal {
  /**
   * Retrieves the withdrawal with the provided id.
   *
   * @param id - The unique identifier of the withdrawal.
   * @returns A promise resolving to the `Withdrawal` or `null` when not
   * found.
   */
  findById(id: EntityId): Promise<Withdrawal | null>;

  /**
   * Retrieves all withdrawals belonging to the provided position id.
   *
   * @param positionId - The unique identifier of the position.
   * @returns A promise resolving to the `Withdrawal` entries or an empty
   * array when there are no matches.
   */
  findAllByPositionId(positionId: EntityId): Promise<Withdrawal[]>;

  /**
   * Retrieves all withdrawals of the provided position whose date falls
   * within the provided period, inclusive.
   *
   * @param positionId - The unique identifier of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the `Withdrawal` entries or an empty
   * array when there are no matches.
   */
  findAllByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date,
  ): Promise<Withdrawal[]>;

  /**
   * Persists the provided withdrawal.
   *
   * When the withdrawal has no id, the implementation inserts a new
   * record and the persisted `Withdrawal` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param withdrawal - The withdrawal to persist.
   * @returns A promise resolving to the persisted `Withdrawal`.
   */
  save(withdrawal: Withdrawal): Promise<Withdrawal>;

  /**
   * Removes the withdrawal with the provided id.
   *
   * @param id - The unique identifier of the withdrawal.
   * @returns A promise that resolves when the withdrawal is removed.
   */
  delete(id: EntityId): Promise<void>;
}
