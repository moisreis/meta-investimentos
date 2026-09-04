import type { UserRole } from "@/business/entities/user/user.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The authenticated user object exposed by an authentication session.
 *
 * The shape is intentionally kept to the minimal surface consumed by
 * the actor resolver so it stays decoupled from any concrete auth
 * framework: the user's id and, when known, their platform role.
 */
export interface SessionUser {
  /**
   * The unique identifier of the authenticated user.
   */
  id: string;

  /**
   * The platform role of the user, when the session carries it.
   */
  role?: UserRole;
}

/**
 * The resolved actor derived from an authenticated session.
 *
 * Every API handler resolves the acting user from the session through a
 * single consistent path: a validated {@link EntityId} and the user's
 * role. This id is what populates the `actorId` accepted by every
 * use-case input.
 */
export interface ResolvedActor {
  /**
   * The validated id of the acting user.
   */
  actorId: EntityId;

  /**
   * The role of the acting user.
   */
  role: UserRole;
}

/**
 * Resolves the acting user from an authentication session.
 *
 * API handlers use this single helper to derive the actor from the
 * session so every handler feeds the same, consistently-shaped
 * `actorId` into the use-case layer. When the session carries no user
 * or the user id is malformed, `null` is returned and the caller treats
 * the request as unauthenticated.
 *
 * @param user - The authenticated session user, or `undefined`/`null`
 * when the request is not authenticated.
 * @returns The resolved actor, or `null` when no valid actor can be
 * derived from the session.
 *
 * @throws {ValidationError} When the session user id is not a valid
 * UUID. This is re-thrown by `EntityId.create` and signals a corrupted
 * session rather than an unauthenticated request.
 */
export function resolveActorFromSession(
  user: SessionUser | null | undefined,
): ResolvedActor | null {
  if (user == null || user.id.trim() === "") {
    return null;
  }

  return {
    actorId: EntityId.create(user.id),
    role: user.role ?? "USER",
  };
}

/**
 * Resolves the acting user's id from an authentication session.
 *
 * A convenience wrapper over {@link resolveActorFromSession} for the
 * common case where a handler only needs the `actorId` string to pass
 * into a use-case input.
 *
 * @param user - The authenticated session user, or `undefined`/`null`.
 * @returns The validated actor id, or `null` when there is no
 * authenticated actor.
 */
export function resolveActorIdFromSession(
  user: SessionUser | null | undefined,
): EntityId | null {
  return resolveActorFromSession(user)?.actorId ?? null;
}
