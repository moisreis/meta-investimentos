import { and, eq, inArray } from "drizzle-orm";

import { Position } from "@/business/entities/portfolio/position.entity";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { position } from "@/infrastructure/database/schemas";
import { ConcurrencyError, NotFoundError } from "@/shared/errors";

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
 * existing row otherwise. Updates are protected by optimistic locking:
 * the update only applies when the persisted version matches the
 * stored one, and the stored version is bumped on success. Updates omit
 * `updatedAt` so the `$onUpdate` hook keeps the timestamp in sync with
 * the mutation.
 */
export class PositionRepository implements IPosition {
  private readonly db: DbClient;

  /**
   * Creates a `PositionRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

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
        version: row.version,
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
      version: entity.version,
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
      version: entity.version + 1,
    };
  }

  /**
   * Retrieves the position with the provided id.
   *
   * @see {@link IPosition.findById}
   */
  async findById(id: EntityId): Promise<Position | null> {
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
  async findAllByPortfolioId(portfolioId: EntityId): Promise<Position[]> {
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
  async findAllByPortfolioIds(portfolioIds: EntityId[]): Promise<Position[]> {
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
   * Retrieves all positions holding any of the provided funds.
   *
   * @see {@link IPosition.findAllByFundIds}
   */
  async findAllByFundIds(fundIds: string[]): Promise<Position[]> {
    if (fundIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(position)
      .where(inArray(position.fundId, fundIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the position holding the provided fund within the
   * provided portfolio.
   *
   * @see {@link IPosition.findByPortfolioIdAndFundId}
   */
  async findByPortfolioIdAndFundId(
    portfolioId: EntityId,
    fundId: EntityId,
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

  /**
   * Persists the provided position.
   *
   * When the position has no id, a new row is inserted; otherwise the
   * existing row is updated only when the persisted version matches the
   * stored version, and its version is bumped.
   *
   * @see {@link IPosition.save}
   */
  async save(persisted: Position): Promise<Position> {
    if (persisted.id) {
      const [row] = await this.db
        .update(position)
        .set(this.toUpdate(persisted))
        .where(
          and(
            eq(position.id, persisted.id),
            eq(position.version, persisted.version),
          ),
        )
        .returning();

      if (row) {
        return this.toEntity(row);
      }

      const [existing] = await this.db
        .select({ id: position.id })
        .from(position)
        .where(eq(position.id, persisted.id))
        .limit(1);

      if (!existing) {
        throw new NotFoundError(
          `Position with id ${persisted.id} was not found.`,
        );
      }

      throw new ConcurrencyError(
        `Position with id ${persisted.id} has a stale version.`,
      );
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
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(position).where(eq(position.id, id));
  }
}
