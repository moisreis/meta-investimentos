import { NotFoundError } from "@errors/not-found.error"
import type { EntityId } from "@/value-objects"
import type { UserRole } from "@/lib/auth/user-role"

/**
 * @summary
 * Asserts the acting user owns the resource or is a manager.
 *
 * @remarks
 * MANAGER bypasses ownership checks. When the acting user
 * is not a manager and does not own the resource, throws
 * NotFoundError to avoid leaking resource existence.
 *
 * @param params - The owner id, user id and user role.
 *
 * @returns true when access is allowed.
 *
 * @throws NotFoundError when access is denied.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function AssertOwnerOrManager(params: {
  ownerId: EntityId | string
  userId: EntityId | string
  role: UserRole
}): true {
  const { ownerId, userId, role } = params
  const OWNER = ownerId.toString()
  const USER = userId.toString()

  if (role === "MANAGER") return true
  if (OWNER === USER) return true

  throw new NotFoundError("`Resource` not found.")
}
