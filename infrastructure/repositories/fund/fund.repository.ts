import { eq, inArray } from "drizzle-orm";

import { Fund } from "@/business/entities/fund/fund.entity";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { fund } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IFund} contract.
 *
 * Maps `fund` rows to `Fund` entities and back. Lookups rely on the
 * primary key, the cnpj unique constraint and the indexes on bank,
 * benchmark and category.
 *
 * Percentage columns are stored as `numeric`, which postgres returns
 * as strings; they are hydrated into `SignedPercentage` value objects
 * and persisted through their `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class FundRepository implements IFund {
  private readonly db: DbClient;

  /**
   * Creates a `FundRepository` bound to the provided database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `fund` row to a {@link Fund} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Fund` entity.
   */
  private toEntity(row: typeof fund.$inferSelect): Fund {
    return Fund.create(
      {
        cnpj: CNPJ.create(row.cnpj),
        name: row.name,
        administrationFee: row.administrationFee
          ? SignedPercentage.create(row.administrationFee)
          : null,
        performanceFee: row.performanceFee
          ? SignedPercentage.create(row.performanceFee)
          : null,
        bankId: EntityId.create(row.bankId),
        benchmarkId: row.benchmarkId ? EntityId.create(row.benchmarkId) : null,
        categoryId: row.categoryId ? EntityId.create(row.categoryId) : null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `fund` table.
   *
   * @param entity - The fund to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Fund): typeof fund.$inferInsert {
    return {
      cnpj: entity.cnpj.value,
      name: entity.name,
      administrationFee: entity.administrationFee?.value.toString() ?? null,
      performanceFee: entity.performanceFee?.value.toString() ?? null,
      bankId: entity.bankId,
      benchmarkId: entity.benchmarkId,
      categoryId: entity.categoryId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `fund` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The fund to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Fund): Partial<typeof fund.$inferInsert> {
    return {
      cnpj: entity.cnpj.value,
      name: entity.name,
      administrationFee: entity.administrationFee?.value.toString() ?? null,
      performanceFee: entity.performanceFee?.value.toString() ?? null,
      bankId: entity.bankId,
      benchmarkId: entity.benchmarkId,
      categoryId: entity.categoryId,
    };
  }

  /**
   * Retrieves the fund with the provided id.
   *
   * @see {@link IFund.findById}
   */
  async findById(id: EntityId): Promise<Fund | null> {
    const [row] = await this.db
      .select()
      .from(fund)
      .where(eq(fund.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all funds with any of the provided ids.
   *
   * Batched lookup for hydrating funds across many ids without falling
   * into an N+1 query pattern.
   *
   * @param ids - The ids of the funds to retrieve.
   * @returns A promise resolving to the matching `Fund` entities.
   */
  async findAllByIds(ids: string[]): Promise<Fund[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.db.select().from(fund).where(inArray(fund.id, ids));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the fund with the provided cnpj.
   *
   * @see {@link IFund.findByCnpj}
   */
  async findByCnpj(cnpj: string): Promise<Fund | null> {
    const [row] = await this.db
      .select()
      .from(fund)
      .where(eq(fund.cnpj, cnpj))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all funds issued by the provided bank id.
   *
   * @see {@link IFund.findAllByBankId}
   */
  async findAllByBankId(bankId: string): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .where(eq(fund.bankId, bankId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all funds benchmarked against the provided benchmark id.
   *
   * @see {@link IFund.findAllByBenchmarkId}
   */
  async findAllByBenchmarkId(benchmarkId: string): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .where(eq(fund.benchmarkId, benchmarkId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all funds tagged with the provided category id.
   *
   * @see {@link IFund.findAllByCategoryId}
   */
  async findAllByCategoryId(categoryId: string): Promise<Fund[]> {
    const rows = await this.db
      .select()
      .from(fund)
      .where(eq(fund.categoryId, categoryId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Persists the provided fund.
   *
   * @see {@link IFund.save}
   */
  async save(persisted: Fund): Promise<Fund> {
    if (persisted.id) {
      const [row] = await this.db
        .update(fund)
        .set(this.toUpdate(persisted))
        .where(eq(fund.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(`Fund with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(fund)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the fund with the provided id.
   *
   * @see {@link IFund.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(fund).where(eq(fund.id, id));
  }
}
