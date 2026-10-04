import {
  ActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"
import type { UserRole } from "@/lib/auth/user-role"
import { HasRole } from "./has-role"

/**
 * @summary
 * Ensures the user role is in the allowed set.
 *
 * @remarks
 * Returns an ActionFailure when the user role is not
 * permitted. Use in server actions to stay consistent
 * with the ActionResult contract.
 *
 * @param userRole - The role of the acting user.
 * @param allowed - The roles allowed to proceed.
 *
 * @returns An ActionResult indicating success or failure.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function RequireRole(
  userRole: UserRole,
  allowed: readonly UserRole[]
): ActionResult<null> {
  if (!HasRole(userRole, allowed)) {
    return ActionFailure("Acesso negado.")
  }
  return { success: true, data: null }
}
