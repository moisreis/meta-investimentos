import { eq, inArray } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Session } from "@domain/session/entities/session.entity"
import type { ISession } from "@domain/session/interfaces/session.interface"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/session.mapper"
import { session } from "@db-schemas/session.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the session persistence contract.
 *
 * @remarks
 * Maps `session` rows to `Session` entities and back.
 * Lookups rely on the primary key, the token unique
 * constraint, and the user id index.
 *
 * @explanation
 * Use this repository for all session data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new SessionRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class SessionRepository implements ISession {
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
   * const REPO = new SessionRepository(DB_CLIENT);
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
   * Retrieves the session with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a session by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the session.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const SESSION = await SESSION_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Session | null> {
    const [ROW] = await this.db
      .select()
      .from(session)
      .where(eq(session.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves the session with the provided token.
   *
   * @remarks
   * Returns null when no row matches the token.
   *
   * @explanation
   * Use this method to load a session by its unique token.
   * Callers must handle the null result.
   *
   * @param token - The unique session token.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const SESSION = await SESSION_REPO.findByToken(TOKEN);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByToken(token: string): Promise<Session | null> {
    const [ROW] = await this.db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
  }

  /**
   * @summary
   * Retrieves every session of the provided user id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load all sessions of a single user.
   *
   * @param userId - The id of the user.
   *
   * @returns The matching sessions.
   *
   * @example
   * const SESSIONS = await SESSION_REPO
   *   .findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserId(userId: EntityId): Promise<Session[]> {
    const ROWS = await this.db
      .select()
      .from(session)
      .where(eq(session.userId, userId))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves all sessions with any of the provided user ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate sessions across many users
   * in one query instead of one query per user.
   *
   * @param userIds - The ids of the users.
   *
   * @returns The matching sessions.
   *
   * @example
   * const SESSIONS = await SESSION_REPO
   *   .findAllByUserIds(USER_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByUserIds(
    userIds: EntityId[]
  ): Promise<Session[]> {
    if (userIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(session)
      .where(inArray(session.userId, userIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Persists the provided session.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row or throws `NotFoundError` when missing.
   *
   * @explanation
   * Use this method to create or update a session. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The session to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await SESSION_REPO.save(SESSION);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Session): Promise<Session> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(session)
        .set(ToUpdate(persisted))
        .where(eq(session.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `Session with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(session)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
  }

  /**
   * @summary
   * Removes the session with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a session by its primary key.
   *
   * @param id - The unique identifier of the session.
   *
   * @example
   * await SESSION_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(session).where(eq(session.id, id))
  }
}
