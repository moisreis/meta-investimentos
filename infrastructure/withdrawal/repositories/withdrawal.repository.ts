import {
  and,
  asc,
  eq,
  gte,
  inArray,
  isNull,
  lte,
  sql,
} from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import type { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import type { WithdrawalTotals } from "@domain/withdrawal/interfaces/withdrawal.interface"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
} from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/withdrawal.mapper"
import { withdrawal } from "@db-schemas/withdrawal.schema"
import { ConcurrencyError } from "@errors/concurrency.error"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the withdrawal persistence contract.
 *
 * @remarks
 * Maps `withdrawal` rows to `Withdrawal` entities and
 * back. Lookups rely on the primary key and the
 * `(position_id, date)` composite index.
 *
 * @explanation
 * Use this repository for all withdrawal data access
 * in the infrastructure layer. It translates rows into
 * domain entities and persists entity changes. Amounts
 * and quotas are stored as **PostgreSQL** `numeric`
 * and hydrated into value objects.
 *
 * @example
 * const REPO = new WithdrawalRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class WithdrawalRepository implements IWithdrawal {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the
   * repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL**
   * client used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new WithdrawalRepository(DB_CLIENT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  constructor(db: DbClient) {
    this.db = db
  }

  /**
   * @summary
   * Retrieves the withdrawal with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a withdrawal by its
   * primary key. Callers must handle the null result.
   *
   * @param id - The unique identifier of the withdrawal.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const WD = await WD_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Withdrawal | null> {
    const [ROW] = await this.db
      .select()
      .from(withdrawal)
      .where(eq(withdrawal.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves all withdrawals for the position id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to list every withdrawal of a
   * position without a date filter.
   *
   * @param positionId - The id of the position.
   *
   * @returns The matching withdrawals.
   *
   * @example
   * const WDS = await WD_REPO
   *   .findAllByPositionId(POSITION_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionId(
    positionId: EntityId
  ): Promise<Withdrawal[]> {
    const ROWS = await this.db
      .select()
      .from(withdrawal)
      .where(eq(withdrawal.positionId, positionId))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves withdrawals of a position in a period.
   *
   * @remarks
   * The period is inclusive of both dates.
   *
   * @explanation
   * Use this method to list the withdrawals of a
   * position inside a date range for processing or
   * reporting.
   *
   * @param positionId - The id of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The matching withdrawals.
   *
   * @example
   * const WDS = await WD_REPO
   *   .findAllByPositionIdInPeriod(ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date
  ): Promise<Withdrawal[]> {
    const ROWS = await this.db
      .select()
      .from(withdrawal)
      .where(
        and(
          eq(withdrawal.positionId, positionId),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate)
        )
      )
      .orderBy(asc(withdrawal.date), asc(withdrawal.createdAt))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves withdrawals for many positions in a
   * period.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. The
   * period is inclusive of both dates.
   *
   * @explanation
   * Use this method to aggregate withdrawals of
   * multiple positions inside a date range in a
   * single query.
   *
   * @param positionIds - The ids of the positions.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The matching withdrawals.
   *
   * @example
   * const WDS = await WD_REPO
   *   .findAllByPositionIdsInPeriod(
   *     IDS, START, END
   *   );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPositionIdsInPeriod(
    positionIds: EntityId[],
    startDate: Date,
    endDate: Date
  ): Promise<Withdrawal[]> {
    if (positionIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(withdrawal)
      .where(
        and(
          inArray(withdrawal.positionId, positionIds),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate)
        )
      )
      .orderBy(asc(withdrawal.date), asc(withdrawal.createdAt))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Sums amounts and quotas for a position in a
   * period.
   *
   * @remarks
   * The period is inclusive of both dates. Reversed
   * withdrawals are excluded from the totals. Returns
   * null fields when no active withdrawals exist in the
   * period.
   *
   * @explanation
   * Use this method to compute aggregate totals of a
   * position within a date range. The aggregation
   * runs in the database instead of the application
   * layer.
   *
   * @param positionId - The id of the position.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The period totals.
   *
   * @example
   * const TOTALS = await WD_REPO
   *   .sumByPositionIdInPeriod(ID, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async sumByPositionIdInPeriod(
    positionId: EntityId,
    startDate: Date,
    endDate: Date
  ): Promise<WithdrawalTotals> {
    const [ROW] = await this.db
      .select({
        amount: sql<string>`sum(${withdrawal.amount})`,
        quotas: sql<string>`sum(${withdrawal.quotas})`,
      })
      .from(withdrawal)
      .where(
        and(
          eq(withdrawal.positionId, positionId),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate),
          isNull(withdrawal.reversedAt)
        )
      )

    return {
      amount: ROW.amount
        ? PositiveMoney.create(ROW.amount)
        : null,
      quotas: ROW.quotas
        ? QuotaQuantity.create(ROW.quotas)
        : null,
    }
  }

  /**
   * @summary
   * Persists the provided withdrawal.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row only when the persisted version
   * matches the stored version, and bumps the version.
   * Throws `ConcurrencyError` on version mismatch and
   * `NotFoundError` when the target row is missing.
   *
   * @explanation
   * Use this method to create or update a withdrawal
   * with optimistic locking. Returns the persisted entity.
   *
   * @param persisted - The withdrawal to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await WD_REPO.save(WD);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Withdrawal): Promise<Withdrawal> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(withdrawal)
        .set({
          ...ToUpdate(persisted),
          version: persisted.version + 1,
        })
        .where(
          and(
            eq(withdrawal.id, persisted.id),
            eq(withdrawal.version, persisted.version)
          )
        )
        .returning()

      if (ROW) {
        return ToDomain(ROW)
      }

      const [EXISTING] = await this.db
        .select({ id: withdrawal.id })
        .from(withdrawal)
        .where(eq(withdrawal.id, persisted.id))
        .limit(1)

      if (!EXISTING) {
        throw new NotFoundError(
          `Withdrawal with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `Withdrawal with id ${persisted.id} has a stale version.`
      )
    }

    const [ROW] = await this.db
      .insert(withdrawal)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the withdrawal with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a withdrawal by its
   * primary key.
   *
   * @param id - The unique identifier of the withdrawal.
   *
   * @example
   * await WD_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(withdrawal).where(eq(withdrawal.id, id))
  }
}
