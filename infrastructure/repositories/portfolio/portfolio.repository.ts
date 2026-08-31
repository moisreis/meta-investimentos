import { eq, inArray } from "drizzle-orm";

import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { IPortfolio } from "@/business/interfaces/portfolio/portfolio.interface";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { portfolio } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IPortfolio} contract.
 *
 * Maps `portfolio` rows to `Portfolio` entities and back. Lookups rely
 * on the primary key and the user id index.
 *
 * Percentage columns are stored as `numeric`, which postgres returns
 * as strings; they are hydrated into `SignedPercentage` value objects
 * and persisted through their `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class PortfolioRepository implements IPortfolio {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `PortfolioRepository` bound to the provided database
   * client.
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
   * Maps the provided `portfolio` row to a {@link Portfolio} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Portfolio` entity.
   */
  private toEntity(row: typeof portfolio.$inferSelect): Portfolio {
    return Portfolio.create(
      {
        acronym: row.acronym,
        name: row.name,
        userId: row.userId,
        annualInterestRate: SignedPercentage.create(row.annualInterestRate),
        minAllocation: SignedPercentage.create(row.minAllocation),
        maxAllocation: SignedPercentage.create(row.maxAllocation),
        targetAllocation: SignedPercentage.create(row.targetAllocation),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `portfolio`
   * table.
   *
   * @param entity - The portfolio to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Portfolio): typeof portfolio.$inferInsert {
    return {
      acronym: entity.acronym,
      name: entity.name,
      userId: entity.userId,
      annualInterestRate: entity.annualInterestRate.value.toString(),
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `portfolio` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The portfolio to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Portfolio): Partial<typeof portfolio.$inferInsert> {
    return {
      acronym: entity.acronym,
      name: entity.name,
      userId: entity.userId,
      annualInterestRate: entity.annualInterestRate.value.toString(),
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the portfolio with the provided id.
   *
   * @see {@link IPortfolio.findById}
   */
  async findById(id: string): Promise<Portfolio | null> {
    const [row] = await this.db
      .select()
      .from(portfolio)
      .where(eq(portfolio.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all portfolios belonging to the provided user id.
   *
   * @see {@link IPortfolio.findAllByUserId}
   */
  async findAllByUserId(userId: string): Promise<Portfolio[]> {
    const rows = await this.db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, userId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all portfolios with any of the provided ids.
   *
   * Batched lookup for hydrating portfolios across many ids without
   * falling into an N+1 query pattern.
   *
   * @param ids - The ids of the portfolios to retrieve.
   * @returns A promise resolving to the matching `Portfolio` entities.
   */
  async findAllByIds(ids: string[]): Promise<Portfolio[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(portfolio)
      .where(inArray(portfolio.id, ids));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided portfolio.
   *
   * @see {@link IPortfolio.save}
   */
  async save(persisted: Portfolio): Promise<Portfolio> {
    if (persisted.id) {
      const [row] = await this.db
        .update(portfolio)
        .set(this.toUpdate(persisted))
        .where(eq(portfolio.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Portfolio with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(portfolio)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the portfolio with the provided id.
   *
   * @see {@link IPortfolio.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(portfolio).where(eq(portfolio.id, id));
  }
}
