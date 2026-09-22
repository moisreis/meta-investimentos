import type { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import type { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"

/**
 * @summary
 * Aggregates withdrawals within a date range.
 *
 * @remarks
 * Carries the summed amount and quota values of the
 * matching withdrawals, or `null` when none match.
 *
 * @explanation
 * Use this shape to return the summed withdrawals of a
 * position within a date range.
 *
 * @example
 * const TOTALS = { amount: null, quotas: null };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface WithdrawalTotals {
  // The sum of amounts, or `null` when absent.
  amount: PositiveMoney | null

  // The sum of quotas, or `null` when absent.
  quotas: QuotaQuantity | null
}

/**
 * @summary
 * Defines the repository contract for `Withdrawal` entities.
 *
 * @remarks
 * An `IWithdrawal` persists, retrieves, and removes withdrawals.
 * Supports lookup by id, position id, and date period.
 *
 * @explanation
 * Use this interface to implement data access for withdrawals.
 * Persistence implementations map rows to `Withdrawal` entities.
 *
 * @example
 * const WD = await WITHDRAWAL_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IWithdrawal {
  /**
   * @summary
   * Retrieves the withdrawal with the provided id.
   *
   * @remarks
   * Returns null when no withdrawal matches.
   *
   * @explanation
   * Use this method to look up a single withdrawal by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the withdrawal.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const WD = await WITHDRAWAL_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Withdrawal | null>

  /**
   * @summary
   * Retrieves all withdrawals of the provided position.
   *
   * @remarks
   * Returns an empty array when no withdrawals match.
   *
   * @explanation
   * Use this method to list withdrawals linked to a
   * position. Returns an empty array for no matches.
   *
   * @param positionId - The unique identifier of the position.
   *
   * @returns The matching entries.
   *
   * @example
   * const WDS = await WITHDRAWAL_REPO
   *   .findAllByPositionId(POS_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPositionId(positionId: EntityId): Promise<Withdrawal[]>

  /**
   * @summary
   * Retrieves the position's withdrawals in the period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns an
   * empty array when no withdrawals match.
   *
   * @explanation
   * Use this method to list withdrawals inside a date
   * range. Includes withdrawals on both period edges.
   *
   * @param positionId - The unique identifier of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The matching entries.
   *
   * @example
   * const WDS = await WITHDRAWAL_REPO
   *   .findAllByPositionIdInPeriod(POS_ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date
  ): Promise<Withdrawal[]>

  /**
   * @summary
   * Retrieves the positions' withdrawals in the period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns an
   * empty array when no withdrawals match.
   *
   * @explanation
   * Use this method to list withdrawals for many positions
   * inside a date range in a single query.
   *
   * @param positionIds - The identifiers of the positions.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The matching entries.
   *
   * @example
   * const WDS = await WITHDRAWAL_REPO
   *   .findAllByPositionIdsInPeriod(POS_IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByPositionIdsInPeriod(
    positionIds: EntityId[],
    startDate: Date,
    endDate: Date
  ): Promise<Withdrawal[]>

  /**
   * @summary
   * Sums withdrawal amounts and quotas within the period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns null
   * values when no withdrawals match.
   *
   * @explanation
   * Use this method to aggregate the withdrawals of a
   * position inside a date range.
   *
   * @param positionId - The identifier of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns Summed totals or `null`.
   *
   * @example
   * const TOTALS = await WITHDRAWAL_REPO
   *   .sumByPositionIdInPeriod(POS_ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  sumByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date
  ): Promise<WithdrawalTotals>

  /**
   * @summary
   * Persists the provided withdrawal.
   *
   * @remarks
   * Inserts a new record when the withdrawal has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a withdrawal.
   * The persisted entity with its id is returned.
   *
   * @param withdrawal - The withdrawal to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const WD = await WITHDRAWAL_REPO.save(NEW_WD);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(withdrawal: Withdrawal): Promise<Withdrawal>

  /**
   * @summary
   * Removes the withdrawal with the provided id.
   *
   * @remarks
   * Resolves when the withdrawal is removed.
   *
   * @explanation
   * Use this method to delete a withdrawal record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the withdrawal.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await WITHDRAWAL_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
