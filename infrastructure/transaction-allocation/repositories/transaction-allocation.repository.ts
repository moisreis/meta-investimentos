import { and, eq, inArray, sql } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { TransactionAllocation } from "@domain/transaction-allocation/entities/transaction-allocation.entity"
import type { ITransactionAllocation } from "@domain/transaction-allocation/interfaces/transaction-allocation.interface"
import { EntityId, QuotaQuantity } from "@/value-objects"
import {
  toDomain,
  toInsert,
  toUpdate,
} from "../mappers/transaction-allocation.mapper"
import { transactionAllocation } from "@db-schemas/transaction-allocation.schema"
import { ConcurrencyError } from "@errors/concurrency.error"
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

    return row ? toDomain(row) : null
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

    return rows.map((row) => toDomain(row))
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
    applicationIds: EntityId[]
  ): Promise<TransactionAllocation[]> {
    if (applicationIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(inArray(transactionAllocation.applicationId, applicationIds))

    return rows.map((row) => toDomain(row))
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

    return rows.map((row) => toDomain(row))
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
    withdrawIds: EntityId[]
  ): Promise<TransactionAllocation[]> {
    if (withdrawIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(inArray(transactionAllocation.withdrawId, withdrawIds))

    return rows.map((row) => toDomain(row))
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
    applicationId: EntityId
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
   * the existing row only when the persisted version
   * matches the stored version, and bumps the version.
   * Throws `ConcurrencyError` on version mismatch and
   * `NotFoundError` when the target row is missing.
   *
   * @explanation
   * Use this method to create or update an allocation
   * with optimistic locking. Returns the persisted entity.
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
        .set({ ...toUpdate(persisted), version: persisted.version + 1 })
        .where(
          and(
            eq(transactionAllocation.id, persisted.id),
            eq(transactionAllocation.version, persisted.version)
          )
        )
        .returning()

      if (row) {
        return toDomain(row)
      }

      const [existing] = await this.db
        .select({ id: transactionAllocation.id })
        .from(transactionAllocation)
        .where(eq(transactionAllocation.id, persisted.id))
        .limit(1)

      if (!existing) {
        throw new NotFoundError(
          `TransactionAllocation with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `TransactionAllocation with id ${persisted.id} has a stale version.`
      )
    }

    const [row] = await this.db
      .insert(transactionAllocation)
      .values(toInsert(persisted))
      .returning()

    return toDomain(row)
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
