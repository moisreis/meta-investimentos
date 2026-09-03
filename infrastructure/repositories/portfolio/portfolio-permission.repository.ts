import { and, eq } from "drizzle-orm";

import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import type { IPortfolioPermission } from "@/business/interfaces/portfolio/portfolio-permission.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { portfolioPermission } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the
 * {@link IPortfolioPermission} contract.
 *
 * Maps `portfolio_permission` rows to `PortfolioPermission`
 * entities and back.
 */
export class PortfolioPermissionRepository implements IPortfolioPermission {
  private readonly db: DbClient;

  /**
   * Creates a `PortfolioPermissionRepository` bound to the
   * provided database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided row to a `PortfolioPermission` entity.
   */
  private toEntity(
    row: typeof portfolioPermission.$inferSelect,
  ): PortfolioPermission {
    return PortfolioPermission.create(
      {
        userId: EntityId.create(row.userId),
        portfolioId: EntityId.create(row.portfolioId),
        role: row.role as "VIEWER" | "EDITOR",
        grantedByUserId: EntityId.create(row.grantedByUserId),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values.
   */
  private toInsert(
    entity: PortfolioPermission,
  ): typeof portfolioPermission.$inferInsert {
    return {
      userId: entity.userId,
      portfolioId: entity.portfolioId,
      role: entity.role,
      grantedByUserId: entity.grantedByUserId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values.
   */
  private toUpdate(
    entity: PortfolioPermission,
  ): Partial<typeof portfolioPermission.$inferInsert> {
    return {
      userId: entity.userId,
      portfolioId: entity.portfolioId,
      role: entity.role,
      grantedByUserId: entity.grantedByUserId,
    };
  }

  /**
   * @see {@link IPortfolioPermission.findById}
   */
  async findById(id: EntityId): Promise<PortfolioPermission | null> {
    const [row] = await this.db
      .select()
      .from(portfolioPermission)
      .where(eq(portfolioPermission.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * @see {@link IPortfolioPermission.findByUserIdAndPortfolioId}
   */
  async findByUserIdAndPortfolioId(
    userId: EntityId,
    portfolioId: EntityId,
  ): Promise<PortfolioPermission | null> {
    const [row] = await this.db
      .select()
      .from(portfolioPermission)
      .where(
        and(
          eq(portfolioPermission.userId, userId),
          eq(portfolioPermission.portfolioId, portfolioId),
        ),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * @see {@link IPortfolioPermission.findAllByUserId}
   */
  async findAllByUserId(userId: EntityId): Promise<PortfolioPermission[]> {
    const rows = await this.db
      .select()
      .from(portfolioPermission)
      .where(eq(portfolioPermission.userId, userId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * @see {@link IPortfolioPermission.findAllByPortfolioId}
   */
  async findAllByPortfolioId(
    portfolioId: EntityId,
  ): Promise<PortfolioPermission[]> {
    const rows = await this.db
      .select()
      .from(portfolioPermission)
      .where(eq(portfolioPermission.portfolioId, portfolioId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * @see {@link IPortfolioPermission.save}
   */
  async save(persisted: PortfolioPermission): Promise<PortfolioPermission> {
    if (persisted.id) {
      const [row] = await this.db
        .update(portfolioPermission)
        .set(this.toUpdate(persisted))
        .where(eq(portfolioPermission.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(
          `PortfolioPermission with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(portfolioPermission)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * @see {@link IPortfolioPermission.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db
      .delete(portfolioPermission)
      .where(eq(portfolioPermission.id, id));
  }

  /**
   * @see {@link IPortfolioPermission.deleteByUserIdAndPortfolioId}
   */
  async deleteByUserIdAndPortfolioId(
    userId: EntityId,
    portfolioId: EntityId,
  ): Promise<void> {
    await this.db
      .delete(portfolioPermission)
      .where(
        and(
          eq(portfolioPermission.userId, userId),
          eq(portfolioPermission.portfolioId, portfolioId),
        ),
      );
  }
}
