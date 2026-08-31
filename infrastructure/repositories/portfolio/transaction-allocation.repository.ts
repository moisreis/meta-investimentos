import { eq, inArray, sql } from "drizzle-orm";

import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import type { ITransactionAllocation } from "@/business/interfaces/portfolio/transaction-allocation.interface";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import { transactionAllocation } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the
 * {@link ITransactionAllocation} contract.
 *
 * Maps `transaction_allocation` rows to `TransactionAllocation`
 * entities and back. Lookups rely on the primary key and the indexes on
 * `application_id` and `withdraw_id`.
 *
 * The `quotasConsumed` column is stored as `numeric`, which postgres
 * returns as a string; it is hydrated into a `QuotaQuantity` value
 * object and persisted through its `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise.
 */
export class TransactionAllocationRepository implements ITransactionAllocation {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `TransactionAllocationRepository` bound to the provided
   * database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `transaction_allocation` row to a
   * {@link TransactionAllocation} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `TransactionAllocation` entity.
   */
  private toEntity(
    row: typeof transactionAllocation.$inferSelect,
  ): TransactionAllocation {
    return TransactionAllocation.create(
      {
        applicationId: row.applicationId,
        withdrawId: row.withdrawId,
        quotasConsumed: QuotaQuantity.create(row.quotasConsumed),
        createdAt: row.createdAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the
   * `transaction_allocation` table.
   *
   * @param entity - The allocation to persist.
   * @returns The insert values.
   */
  private toInsert(
    entity: TransactionAllocation,
  ): typeof transactionAllocation.$inferInsert {
    return {
      applicationId: entity.applicationId,
      withdrawId: entity.withdrawId,
      quotasConsumed: entity.quotasConsumed.value.toString(),
      createdAt: entity.createdAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `transaction_allocation` table.
   *
   * `createdAt` never changes and is left out of the update.
   *
   * @param entity - The allocation to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: TransactionAllocation,
  ): Partial<typeof transactionAllocation.$inferInsert> {
    return {
      applicationId: entity.applicationId,
      withdrawId: entity.withdrawId,
      quotasConsumed: entity.quotasConsumed.value.toString(),
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the transaction allocation with the provided id.
   *
   * @see {@link ITransactionAllocation.findById}
   */
  async findById(id: string): Promise<TransactionAllocation | null> {
    const [row] = await this.db
      .select()
      .from(transactionAllocation)
      .where(eq(transactionAllocation.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all transaction allocations belonging to the provided
   * application id.
   *
   * @see {@link ITransactionAllocation.findAllByApplicationId}
   */
  async findAllByApplicationId(
    applicationId: string,
  ): Promise<TransactionAllocation[]> {
    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(eq(transactionAllocation.applicationId, applicationId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all transaction allocations belonging to any of the
   * provided application ids.
   *
   * Batched lookup for consuming applications across many transaction
   * allocations without falling into an N+1 query pattern.
   *
   * @param applicationIds - The ids of the applications to retrieve
   *   allocations for.
   * @returns A promise resolving to the matching `TransactionAllocation`
   *   entities.
   */
  async findAllByApplicationIds(
    applicationIds: string[],
  ): Promise<TransactionAllocation[]> {
    if (applicationIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(inArray(transactionAllocation.applicationId, applicationIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all transaction allocations belonging to the provided
   * withdrawal id.
   *
   * @see {@link ITransactionAllocation.findAllByWithdrawalId}
   */
  async findAllByWithdrawalId(
    withdrawId: string,
  ): Promise<TransactionAllocation[]> {
    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(eq(transactionAllocation.withdrawId, withdrawId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all transaction allocations belonging to any of the
   * provided withdrawal ids.
   *
   * Batched lookup for resolving which applications fund many
   * withdrawals without falling into an N+1 query pattern.
   *
   * @param withdrawIds - The ids of the withdrawals to retrieve
   *   allocations for.
   * @returns A promise resolving to the matching `TransactionAllocation`
   *   entities.
   */
  async findAllByWithdrawIds(
    withdrawIds: string[],
  ): Promise<TransactionAllocation[]> {
    if (withdrawIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(transactionAllocation)
      .where(inArray(transactionAllocation.withdrawId, withdrawIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Sums the quotas consumed from the provided application across its
   * allocations.
   *
   * This pushes the reduction into the database: streaming every
   * `findAllByApplicationId` row into a running total would be wasted
   * work for what is a single aggregate.
   *
   * @param applicationId - The id of the application to total.
   * @returns A promise resolving to the consumed quotas, or `null` when
   *   the application has no allocations.
   */
  async sumQuotasConsumedByApplicationId(
    applicationId: string,
  ): Promise<QuotaQuantity | null> {
    const [row] = await this.db
      .select({
        quotasConsumed: sql<string>`sum(${transactionAllocation.quotasConsumed})`,
      })
      .from(transactionAllocation)
      .where(eq(transactionAllocation.applicationId, applicationId));

    return row.quotasConsumed ? QuotaQuantity.create(row.quotasConsumed) : null;
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided transaction allocation.
   *
   * @see {@link ITransactionAllocation.save}
   */
  async save(persisted: TransactionAllocation): Promise<TransactionAllocation> {
    if (persisted.id) {
      const [row] = await this.db
        .update(transactionAllocation)
        .set(this.toUpdate(persisted))
        .where(eq(transactionAllocation.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(
          `TransactionAllocation with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(transactionAllocation)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the transaction allocation with the provided id.
   *
   * @see {@link ITransactionAllocation.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db
      .delete(transactionAllocation)
      .where(eq(transactionAllocation.id, id));
  }
}
