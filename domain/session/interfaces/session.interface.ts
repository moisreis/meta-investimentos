import type { Session } from "@domain/session/entities/session.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Session` entities.
 *
 * @remarks
 * An `ISession` persists, retrieves, and removes sessions.
 * Supports lookup by id, token, and user id.
 *
 * @explanation
 * Use this interface to implement data access for sessions.
 * Persistence implementations map rows to `Session` entities.
 *
 * @example
 * const SESS = await SESSION_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface ISession {
  /**
   * @summary
   * Retrieves the session with the provided id.
   *
   * @remarks
   * Returns null when no session matches.
   *
   * @explanation
   * Use this method to look up a single session by its
   * unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the session.
   * @returns The entry or `null`.
   *
   * @example
   * const SESS = await SESSION_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Session | null>

  /**
   * @summary
   * Retrieves the session with the provided token.
   *
   * @remarks
   * Returns null when no session matches.
   *
   * @explanation
   * Use this method to look up a session by its
   * authentication token. Callers check null for existence.
   *
   * @param token - The token of the session.
   * @returns The entry or `null`.
   *
   * @example
   * const SESS = await SESSION_REPO.findByToken(TOKEN);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByToken(token: string): Promise<Session | null>

  /**
   * @summary
   * Retrieves all sessions belonging to the provided user.
   *
   * @remarks
   * Returns an empty array when no sessions match.
   *
   * @explanation
   * Use this method to list all sessions linked to a
   * user. Returns an empty array for no matches.
   *
   * @param userId - The id of the user.
   * @returns The matching entries.
   *
   * @example
   * const SESS = await SESSION_REPO.findAllByUserId(USER_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByUserId(userId: EntityId): Promise<Session[]>

  /**
   * @summary
   * Retrieves all sessions of the provided users.
   *
   * @remarks
   * Returns an empty array when no sessions match.
   *
   * @explanation
   * Use this method to list sessions linked to several
   * users. Returns an empty array for no matches.
   *
   * @param userIds - The ids of the users.
   * @returns The matching entries.
   *
   * @example
   * const SESS = await SESSION_REPO
   *   .findAllByUserIds(USER_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByUserIds(userIds: EntityId[]): Promise<Session[]>

  /**
   * @summary
   * Persists the provided session.
   *
   * @remarks
   * Inserts a new record when the session has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a session.
   * The persisted entity with its id is returned.
   *
   * @param session - The session to persist.
   * @returns The persisted entry.
   *
   * @example
   * const SESS = await SESSION_REPO.save(NEW_SESS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(session: Session): Promise<Session>

  /**
   * @summary
   * Removes the session with the provided id.
   *
   * @remarks
   * Resolves when the session is removed.
   *
   * @explanation
   * Use this method to delete a session record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the session.
   * @returns Resolves when removed.
   *
   * @example
   * await SESSION_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
