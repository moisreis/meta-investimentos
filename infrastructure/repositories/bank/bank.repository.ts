import { asc, eq, inArray } from "drizzle-orm";

import { Bank } from "@/business/entities/bank/bank.entity";
import type { IBank } from "@/business/interfaces/bank/bank.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { bank } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IBank} contract.
 *
 * Maps `bank` rows to `Bank` entities and back. Lookups rely on the
 * primary key and the code unique constraint.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class BankRepository implements IBank {
  private readonly db: DbClient;

  /**
   * Creates a `BankRepository` bound to the provided database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `bank` row to a {@link Bank} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Bank` entity.
   */
  private toEntity(row: typeof bank.$inferSelect): Bank {
    return Bank.create(
      {
        code: row.code,
        name: row.name,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `bank` table.
   *
   * @param entity - The bank to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Bank): typeof bank.$inferInsert {
    return {
      code: entity.code,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `bank` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The bank to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Bank): Partial<typeof bank.$inferInsert> {
    return {
      code: entity.code,
      name: entity.name,
    };
  }

  /**
   * Retrieves the bank with the provided id.
   *
   * @see {@link IBank.findById}
   */
  async findById(id: EntityId): Promise<Bank | null> {
    const [row] = await this.db
      .select()
      .from(bank)
      .where(eq(bank.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the bank with the provided code.
   *
   * @see {@link IBank.findByCode}
   */
  async findByCode(code: string): Promise<Bank | null> {
    const [row] = await this.db
      .select()
      .from(bank)
      .where(eq(bank.code, code))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all banks, optionally paginated.
   *
   * @see {@link IBank.findAll}
   */
  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Bank[]> {
    const rows = await this.db
      .select()
      .from(bank)
      .orderBy(asc(bank.code))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0);

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all banks with any of the provided ids.
   *
   * Batched lookup for hydrating many banks without falling into an
   * N+1 query pattern.
   *
   * @param ids - The ids of the banks to retrieve.
   * @returns A promise resolving to the matching `Bank` entities.
   */
  async findAllByIds(ids: string[]): Promise<Bank[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.db.select().from(bank).where(inArray(bank.id, ids));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Persists the provided bank.
   *
   * @see {@link IBank.save}
   */
  async save(persisted: Bank): Promise<Bank> {
    if (persisted.id) {
      const [row] = await this.db
        .update(bank)
        .set(this.toUpdate(persisted))
        .where(eq(bank.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(`Bank with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(bank)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the bank with the provided id.
   *
   * @see {@link IBank.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(bank).where(eq(bank.id, id));
  }
}
