import { and, eq, gte, inArray, lte, sql } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import type { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"
import { withdrawal } from "@db-schemas/withdrawal.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Holds the aggregate totals of a position period.
 *
 * @remarks
 * Amounts and quotas are value objects. They are null
 * when no transaction exists in the period.
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
   * Maps a database row to a domain entity.
   *
   * @remarks
   * Hydrates value objects through their `create`
   * method.
   *
   * @explanation
   * Converts persisted columns into the domain shape
   * so services work with entities, not raw rows.
   *
   * @param row - The row returned by the query.
   * @returns The hydrated entity.
   *
   * @example
   * const ENTITY = toEntity(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(row: typeof withdrawal.$inferSelect): Withdrawal {
    return Withdrawal.create(
      {
        positionId: EntityId.create(row.positionId),
        date: row.date,
        amount: PositiveMoney.create(row.amount),
        quotas: QuotaQuantity.create(row.quotas),
        reversedAt: row.reversedAt,
        reversedByUserId: row.reversedByUserId
          ? EntityId.create(row.reversedByUserId)
          : null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps an entity to insert values.
   *
   * @remarks
   * Serializes value objects through their `.value`
   * property for **PostgreSQL** storage.
   *
   * @explanation
   * Converts domain columns into a shape that the
   * `withdrawal` insert statement accepts.
   *
   * @param entity - The entity to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Withdrawal): typeof withdrawal.$inferInsert {
    return {
      positionId: entity.positionId,
      date: entity.date,
      amount: entity.amount.value.toString(),
      quotas: entity.quotas.value.toString(),
      reversedAt: entity.reversedAt,
      reversedByUserId: entity.reversedByUserId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps an entity to mutable update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The `updatedAt`
   * column refreshes through the `$onUpdate` hook.
   *
   * @explanation
   * Converts domain columns into a partial shape for
   * the `withdrawal` update statement.
   *
   * @param entity - The entity to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(
    entity: Withdrawal
  ): Partial<typeof withdrawal.$inferInsert> {
    return {
      positionId: entity.positionId,
      date: entity.date,
      amount: entity.amount.value.toString(),
      quotas: entity.quotas.value.toString(),
      reversedAt: entity.reversedAt,
      reversedByUserId: entity.reversedByUserId,
    }
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
    const [row] = await this.db
      .select()
      .from(withdrawal)
      .where(eq(withdrawal.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
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
  async findAllByPositionId(positionId: EntityId): Promise<Withdrawal[]> {
    const rows = await this.db
      .select()
      .from(withdrawal)
      .where(eq(withdrawal.positionId, positionId))

    return rows.map((row) => this.toEntity(row))
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
    const rows = await this.db
      .select()
      .from(withdrawal)
      .where(
        and(
          eq(withdrawal.positionId, positionId),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate)
        )
      )

    return rows.map((row) => this.toEntity(row))
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
    positionIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Withdrawal[]> {
    if (positionIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(withdrawal)
      .where(
        and(
          inArray(withdrawal.positionId, positionIds),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate)
        )
      )

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Sums amounts and quotas for a position in a
   * period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns
   * null fields when no withdrawals exist in the
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
    positionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<WithdrawalTotals> {
    const [row] = await this.db
      .select({
        amount: sql<string>`sum(${withdrawal.amount})`,
        quotas: sql<string>`sum(${withdrawal.quotas})`,
      })
      .from(withdrawal)
      .where(
        and(
          eq(withdrawal.positionId, positionId),
          gte(withdrawal.date, startDate),
          lte(withdrawal.date, endDate)
        )
      )

    return {
      amount: row.amount ? PositiveMoney.create(row.amount) : null,
      quotas: row.quotas ? QuotaQuantity.create(row.quotas) : null,
    }
  }

  /**
   * @summary
   * Persists the provided withdrawal.
   *
   * @remarks
   * Inserts a new row when the entity has no id.
   * Updates the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a withdrawal.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The withdrawal to persist.
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
      const [row] = await this.db
        .update(withdrawal)
        .set(this.toUpdate(persisted))
        .where(eq(withdrawal.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Withdrawal with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(withdrawal)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
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
