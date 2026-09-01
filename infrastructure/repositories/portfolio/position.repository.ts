import { and, eq, inArray } from "drizzle-orm";

import { Position } from "@/business/entities/portfolio/position.entity";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import { position } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IPosition} contract.
 *
 * Maps `position` rows to `Position` entities and back. Lookups rely on
 * the primary key, the portfolio index and the unique
 * `(portfolio_id, fund_id)` pair.
 *
 * The `initialBalance` column is stored as `numeric`, which postgres
 * returns as a string; it is hydrated into a `PositiveMoney` value
 * object and persisted through its `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class PositionRepository implements IPosition {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `PositionRepository` bound to the provided database
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
   * Maps the provided `position` row to a {@link Position} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Position` entity.
   */
  private toEntity(row: typeof position.$inferSelect): Position {
    return Position.create(
      {
        portfolioId: EntityId.create(row.portfolioId),
        fundId: EntityId.create(row.fundId),
        initialBalance: row.initialBalance
          ? PositiveMoney.create(row.initialBalance)
          : null,
        initialBalanceDate: row.initialBalanceDate,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `position`
   * table.
   *
   * @param entity - The position to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Position): typeof position.$inferInsert {
    return {
      portfolioId: entity.portfolioId,
      fundId: entity.fundId,
      initialBalance: entity.initialBalance?.value.toString() ?? null,
      initialBalanceDate: entity.initialBalanceDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `position` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The position to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Position): Partial<typeof position.$inferInsert> {
    return {
      portfolioId: entity.portfolioId,
      fundId: entity.fundId,
      initialBalance: entity.initialBalance?.value.toString() ?? null,
      initialBalanceDate: entity.initialBalanceDate,
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the position with the provided id.
   *
   * @see {@link IPosition.findById}
   */
  async findById(id: string): Promise<Position | null> {
    const [row] = await this.db
      .select()
      .from(position)
      .where(eq(position.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all positions belonging to the provided portfolio id.
   *
   * @see {@link IPosition.findAllByPortfolioId}
   */
  async findAllByPortfolioId(portfolioId: string): Promise<Position[]> {
    const rows = await this.db
      .select()
      .from(position)
      .where(eq(position.portfolioId, portfolioId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all positions belonging to any of the provided portfolio
   * ids.
   *
   * Batched lookup for hydrating the positions of many portfolios
   * without falling into an N+1 query pattern.
   *
   * @param portfolioIds - The ids of the portfolios to retrieve
   *   positions for.
   * @returns A promise resolving to the matching `Position` entities.
   */
  async findAllByPortfolioIds(portfolioIds: string[]): Promise<Position[]> {
    if (portfolioIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(position)
      .where(inArray(position.portfolioId, portfolioIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the position holding the provided fund within the
   * provided portfolio.
   *
   * @see {@link IPosition.findByPortfolioIdAndFundId}
   */
  async findByPortfolioIdAndFundId(
    portfolioId: string,
    fundId: string,
  ): Promise<Position | null> {
    const [row] = await this.db
      .select()
      .from(position)
      .where(
        and(eq(position.portfolioId, portfolioId), eq(position.fundId, fundId)),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided position.
   *
   * @see {@link IPosition.save}
   */
  async save(persisted: Position): Promise<Position> {
    if (persisted.id) {
      const [row] = await this.db
        .update(position)
        .set(this.toUpdate(persisted))
        .where(eq(position.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Position with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(position)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the position with the provided id.
   *
   * @see {@link IPosition.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(position).where(eq(position.id, id));
  }
}
