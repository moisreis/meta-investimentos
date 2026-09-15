import { eq, inArray, sql } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { TransactionAllocation } from "@domain/transaction-allocation/entities/transaction-allocation.entity"
import type { ITransactionAllocation } from "@domain/transaction-allocation/interfaces/transaction-allocation.interface"
import { EntityId, QuotaQuantity } from "@/value-objects"
import { transactionAllocation } from "@db-schemas/transaction-allocation.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the transaction allocation persistence contract.
 *
 * @remarks
 * Maps `transaction_allocation` rows to entities and back. The
 * `quotasConsumed` returns as a string from **PostgreSQL**
 * and hydrates into a `QuotaQuantity` value object. Lookups
 * rely on the primary key and the indexes on `application_id`
 * and `withdraw_id`.
 *
 * @explanation
 * Use this repository for all transaction allocation data
 * access in the infrastructure layer. It translates persisted
 * rows into domain entities.
 *
 * @example
 * const REPO = new TransactionAllocationRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class TransactionAllocationRepository implements ITransactionAllocation {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL** client
   * used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const REPO = new TransactionAllocationRepository(DB_CLIENT);
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
   * Hydrates consumed quotas through `QuotaQuantity.create`.
   *
   * @explanation
   * Converts persisted columns into the domain shape so
   * services work with entities, not raw rows.
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
  private toEntity(
    row: typeof transactionAllocation.$inferSelect
  ): TransactionAllocation {
    return TransactionAllocation.create(
      {
        applicationId: EntityId.create(row.applicationId),
        withdrawId: EntityId.create(row.withdrawId),
        quotasConsumed: QuotaQuantity.create(row.quotasConsumed),
        createdAt: row.createdAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Serializes consumed quotas with `.value.toString()`.
   *
   * @explanation
   * Use this mapper to build the row inserted when the
   * entity has no id.
   *
   * @param entity - The allocation to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(
    entity: TransactionAllocation
  ): typeof transactionAllocation.$inferInsert {
    return {
      applicationId: entity.applicationId,
      withdrawId: entity.withdrawId,
      quotasConsumed: entity.quotasConsumed.value.toString(),
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to update values.
   *
   * @remarks
   * `createdAt` never changes and is left out of the
   * update. Consumed quotas serialize with
   * `.value.toString()`.
   *
   * @explanation
   * Use this mapper to build the row updated when the
   * entity already has an id.
   *
   * @param entity - The allocation to persist.
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
    entity: TransactionAllocation
  ): Partial<typeof transactionAllocation.$inferInsert> {
    return {
      applicationId: entity.applicationId,
      withdrawId: entity.withdrawId,
      quotasConsumed: entity.quotasConsumed.value.toString(),
    }
  }

  /**
   * @summary
   * Retrieves the allocation with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load an allocation by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the allocation.
   * @returns The entity or `null`.
   *
   * @example
   * const ALLOC = await ALLOC_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<TransactionAllocation | null> {
    const [row] = await this.db
      .select()
      .from(transactionAllocation)
      .where(eq(transactionAllocation.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves every allocation of the provided application id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all allocations that consume
   * quotas from one application.
   *
   * @param applicationId - The id of the application.
   * @returns The matching allocations.
   *
   * @example
   * const ALLOCS = await ALLOC_REPO
   *   .findAllByApplicationId(APPLICATION_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByApplicationId(
    applicationId: EntityId
  ): Promise<TransactionAllocation[]> {
    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(eq(transactionAllocation.applicationId, applicationId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves allocations of any provided application id.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate allocations across many
   * applications in one query instead of one per application.
   *
   * @param applicationIds - The ids of the applications.
   * @returns The matching allocations.
   *
   * @example
   * const ALLOCS = await ALLOC_REPO
   *   .findAllByApplicationIds(APPLICATION_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByApplicationIds(
    applicationIds: string[]
  ): Promise<TransactionAllocation[]> {
    if (applicationIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(inArray(transactionAllocation.applicationId, applicationIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves every allocation of the provided withdrawal id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load the allocations that fund one
   * withdrawal.
   *
   * @param withdrawId - The id of the withdrawal.
   * @returns The matching allocations.
   *
   * @example
   * const ALLOCS = await ALLOC_REPO
   *   .findAllByWithdrawalId(WITHDRAW_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByWithdrawalId(
    withdrawId: EntityId
  ): Promise<TransactionAllocation[]> {
    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(eq(transactionAllocation.withdrawId, withdrawId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves allocations of any provided withdrawal id.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids match.
   *
   * @explanation
   * Use this method to resolve which applications fund many
   * withdrawals in one query instead of one per withdrawal.
   *
   * @param withdrawIds - The ids of the withdrawals.
   * @returns The matching allocations.
   *
   * @example
   * const ALLOCS = await ALLOC_REPO
   *   .findAllByWithdrawIds(WITHDRAW_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByWithdrawIds(
    withdrawIds: string[]
  ): Promise<TransactionAllocation[]> {
    if (withdrawIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(inArray(transactionAllocation.withdrawId, withdrawIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Sums the quotas consumed by an application.
   *
   * @remarks
   * Pushes the reduction into the database with a `sum`
   * aggregate. Returns null when the application has no
   * allocations.
   *
   * @explanation
   * Use this method to know the total quotas an application
   * already consumed from the fund.
   *
   * @param applicationId - The id of the application.
   * @returns Quotas sum or null.
   *
   * @example
   * const TOTAL = await ALLOC_REPO
   *   .sumQuotasConsumedByApplicationId(APPLICATION_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async sumQuotasConsumedByApplicationId(
    applicationId: string
  ): Promise<QuotaQuantity | null> {
    const [row] = await this.db
      .select({
        quotasConsumed: sql<string>`sum(${transactionAllocation.quotasConsumed})`,
      })
      .from(transactionAllocation)
      .where(eq(transactionAllocation.applicationId, applicationId))

    return row.quotasConsumed ? QuotaQuantity.create(row.quotasConsumed) : null
  }

  /**
   * @summary
   * Persists the provided transaction allocation.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row or throws `NotFoundError` when missing.
   *
   * @explanation
   * Use this method to create or update an allocation.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The allocation to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await ALLOC_REPO.save(ALLOCATION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: TransactionAllocation): Promise<TransactionAllocation> {
    if (persisted.id) {
      const [row] = await this.db
        .update(transactionAllocation)
        .set(this.toUpdate(persisted))
        .where(eq(transactionAllocation.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `TransactionAllocation with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(transactionAllocation)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the allocation with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete an allocation by its primary
   * key.
   *
   * @param id - The unique identifier of the allocation.
   *
   * @example
   * await ALLOC_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db
      .delete(transactionAllocation)
      .where(eq(transactionAllocation.id, id))
  }
}
