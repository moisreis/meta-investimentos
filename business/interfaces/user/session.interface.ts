import type { Session } from "@/business/entities/user/session.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `Session` entities.
 *
 * An `ISession`:
 * - persists sessions through {@link ISession.save}.
 * - retrieves sessions by id, token, and user id.
 * - removes sessions by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Session` entities and back.
 */
export interface ISession {
  /**
   * Retrieves the session with the provided id.
   *
   * @param id - The unique identifier of the session.
   * @returns A promise resolving to the `Session` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<Session | null>;

  /**
   * Retrieves the session with the provided token.
   *
   * @param token - The token of the session.
   * @returns A promise resolving to the `Session` or `null` when
   * not found.
   */
  findByToken(token: string): Promise<Session | null>;

  /**
   * Retrieves all sessions belonging to the provided user id.
   *
   * @param userId - The id of the user the sessions belong to.
   * @returns A promise resolving to all matching `Session` entities.
   */
  findAllByUserId(userId: EntityId): Promise<Session[]>;

  /**
   * Persists the provided session.
   *
   * When the session has no id, the implementation inserts a new
   * record and the persisted `Session` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param session - The session to persist.
   * @returns A promise resolving to the persisted `Session`.
   */
  save(session: Session): Promise<Session>;

  /**
   * Removes the session with the provided id.
   *
   * @param id - The unique identifier of the session.
   * @returns A promise that resolves when the session is removed.
   */
  delete(id: EntityId): Promise<void>;
}
