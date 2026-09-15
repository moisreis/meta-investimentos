import { eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Statement } from "@domain/statement/entities/statement.entity"
import type { IStatement } from "@domain/statement/interfaces/statement.interface"
import { EntityId } from "@/value-objects"
import { statement } from "@db-schemas/statement.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the statement persistence contract.
 *
 * @remarks
 * Maps `statement` rows to entities and back. The date typed
 * `periodStart` and `periodEnd` columns return as strings and
 * hydrate through `new Date`. Lookups rely on the primary key
 * and the indexes on portfolio and generating user ids.
 *
 * @explanation
 * Use this repository for all statement data access in the
 * infrastructure layer. It translates persisted rows into
 * domain entities.
 *
 * @example
 * const REPO = new StatementRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class StatementRepository implements IStatement {
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
   * const REPO = new StatementRepository(DB_CLIENT);
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
   * Hydrates `periodStart` and `periodEnd` through `new Date`.
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
  private toEntity(row: typeof statement.$inferSelect): Statement {
    return Statement.create(
      {
        portfolioId: row.portfolioId ? EntityId.create(row.portfolioId) : null,
        periodStart: new Date(row.periodStart),
        periodEnd: new Date(row.periodEnd),
        fileUrl: row.fileUrl,
        generatedByUserId: row.generatedByUserId
          ? EntityId.create(row.generatedByUserId)
          : null,
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
   * Serializes period dates through `toISOString()`.
   *
   * @explanation
   * Use this mapper to build the row inserted when the
   * entity has no id.
   *
   * @param entity - The statement to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Statement): typeof statement.$inferInsert {
    return {
      portfolioId: entity.portfolioId,
      periodStart: entity.periodStart.toISOString(),
      periodEnd: entity.periodEnd.toISOString(),
      fileUrl: entity.fileUrl,
      generatedByUserId: entity.generatedByUserId,
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to update values.
   *
   * @remarks
   * `createdAt` never changes and is left out of the update.
   * Period dates serialize through `toISOString()`.
   *
   * @explanation
   * Use this mapper to build the row updated when the
   * entity already has an id.
   *
   * @param entity - The statement to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Statement): Partial<typeof statement.$inferInsert> {
    return {
      portfolioId: entity.portfolioId,
      periodStart: entity.periodStart.toISOString(),
      periodEnd: entity.periodEnd.toISOString(),
      fileUrl: entity.fileUrl,
      generatedByUserId: entity.generatedByUserId,
    }
  }

  /**
   * @summary
   * Retrieves the statement with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a statement by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the statement.
   * @returns The entity or `null`.
   *
   * @example
   * const STATEMENT = await STMT_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Statement | null> {
    const [row] = await this.db
      .select()
      .from(statement)
      .where(eq(statement.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves every statement of the provided portfolio id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all statements of a single
   * portfolio.
   *
   * @param portfolioId - The id of the portfolio.
   * @returns The matching statements.
   *
   * @example
   * const STATEMENTS = await STMT_REPO
   *   .findAllByPortfolioId(PORTFOLIO_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioId(portfolioId: EntityId): Promise<Statement[]> {
    const rows = await this.db
      .select()
      .from(statement)
      .where(eq(statement.portfolioId, portfolioId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves statements of any provided portfolio id.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate statements across many
   * portfolios in one query instead of one per portfolio.
   *
   * @param portfolioIds - The ids of the portfolios.
   * @returns The matching statements.
   *
   * @example
   * const STATEMENTS = await STMT_REPO
   *   .findAllByPortfolioIds(PORTFOLIO_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByPortfolioIds(portfolioIds: string[]): Promise<Statement[]> {
    if (portfolioIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(statement)
      .where(inArray(statement.portfolioId, portfolioIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves every statement a user generated.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all statements generated by a
   * single user.
   *
   * @param userId - The id of the generating user.
   * @returns The matching statements.
   *
   * @example
   * const STATEMENTS = await STMT_REPO
   *   .findAllByGeneratedByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByGeneratedByUserId(userId: EntityId): Promise<Statement[]> {
    const rows = await this.db
      .select()
      .from(statement)
      .where(eq(statement.generatedByUserId, userId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves every statement any provided user generated.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns an
   * empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate statements across many
   * generating users in one query instead of one per user.
   *
   * @param userIds - The ids of the generating users.
   * @returns The matching statements.
   *
   * @example
   * const STATEMENTS = await STMT_REPO
   *   .findAllByGeneratedByUserIds(USER_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByGeneratedByUserIds(userIds: string[]): Promise<Statement[]> {
    if (userIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(statement)
      .where(inArray(statement.generatedByUserId, userIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided statement.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row or throws `NotFoundError` when missing.
   *
   * @explanation
   * Use this method to create or update a statement. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The statement to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await STMT_REPO.save(STATEMENT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Statement): Promise<Statement> {
    if (persisted.id) {
      const [row] = await this.db
        .update(statement)
        .set(this.toUpdate(persisted))
        .where(eq(statement.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Statement with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(statement)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the statement with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a statement by its primary key.
   *
   * @param id - The unique identifier of the statement.
   *
   * @example
   * await STMT_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(statement).where(eq(statement.id, id))
  }
}
