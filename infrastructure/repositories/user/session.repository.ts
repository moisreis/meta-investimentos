import { eq, inArray } from "drizzle-orm";

import { Session } from "@/business/entities/user/session.entity";
import type { ISession } from "@/business/interfaces/user/session.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { session } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link ISession} contract.
 *
 * Maps `session` rows to `Session` entities and back. Lookups rely on
 * the primary key, the token unique constraint and the user id index.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class SessionRepository implements ISession {
  private readonly db: DbClient;

  /**
   * Creates a `SessionRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `session` row to a {@link Session} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Session` entity.
   */
  private toEntity(row: typeof session.$inferSelect): Session {
    return Session.create(
      {
        userId: EntityId.create(row.userId),
        token: row.token,
        expiresAt: row.expiresAt,
        ipAddress: row.ipAddress,
        userAgent: row.userAgent,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `session`
   * table.
   *
   * @param entity - The session to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Session): typeof session.$inferInsert {
    return {
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `session` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The session to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Session): Partial<typeof session.$inferInsert> {
    return {
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
    };
  }

  /**
   * Retrieves the session with the provided id.
   *
   * @see {@link ISession.findById}
   */
  async findById(id: EntityId): Promise<Session | null> {
    const [row] = await this.db
      .select()
      .from(session)
      .where(eq(session.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the session with the provided token.
   *
   * @see {@link ISession.findByToken}
   */
  async findByToken(token: string): Promise<Session | null> {
    const [row] = await this.db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all sessions belonging to the provided user id.
   *
   * @see {@link ISession.findAllByUserId}
   */
  async findAllByUserId(userId: EntityId): Promise<Session[]> {
    const rows = await this.db
      .select()
      .from(session)
      .where(eq(session.userId, userId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all sessions belonging to any of the provided user ids.
   *
   * Batched lookup for hydrating sessions across many users without
   * falling into an N+1 query pattern.
   *
   * @param userIds - The ids of the users to retrieve sessions for.
   * @returns A promise resolving to the matching `Session` entities.
   */
  async findAllByUserIds(userIds: string[]): Promise<Session[]> {
    if (userIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(session)
      .where(inArray(session.userId, userIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Persists the provided session.
   *
   * @see {@link ISession.save}
   */
  async save(persisted: Session): Promise<Session> {
    if (persisted.id) {
      const [row] = await this.db
        .update(session)
        .set(this.toUpdate(persisted))
        .where(eq(session.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(
          `Session with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(session)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the session with the provided id.
   *
   * @see {@link ISession.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(session).where(eq(session.id, id));
  }
}
